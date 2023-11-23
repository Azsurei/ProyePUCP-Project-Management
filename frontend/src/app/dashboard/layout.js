"use client";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import DashboardNav from "@/components/dashboardComps/DashboardNav";
import DashboardSecondNav from "@/components/dashboardComps/DashboardSecondNav";
import { createContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import axios from "axios";
import { Toaster, toast } from "sonner";
axios.defaults.withCredentials = true;

export const SessionContext = createContext();
export const NotificationsContext = createContext();

export default function RootLayout({ children }) {
    const [sessionData, setSessionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const socketRef = useRef(null);

    const setSession = (session) => {
        setSessionData(session);
    };

    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        setIsLoading(true);

        // Clean up on component unmount

        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL + "/api/usuario/verInfoUsuario";

        axios
            .get(stringURL)
            .then(function (response) {
                const user_data = response.data.usuario[0];
                user_data.rolInProject = null;
                user_data.rolNameInProject = null;

                console.log(
                    "INFO DEL USUARIO LOGEADO : " + JSON.stringify(user_data)
                );

                setSessionData(user_data);

                const notisURL =
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/usuario/listarNotificaciones";

                axios
                    .post(notisURL, { idUsuario: user_data.idUsuario })
                    .then(function (response) {
                        console.log(response);
                        setNotifications(response.data.notificaciones);

                        //console.log("le estoy mandando el id " + userData)
                        socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
                            path: '/socket/',
                            withCredentials: true,
                            "Access-Control-Allow-Credentials" : true,
                            query: {
                                idUsuario: user_data.idUsuario,
                                nombresUsuario: user_data.nombres,
                            },
                        });

                        // Log user connection
                        console.log(
                            "Connected to Socket.io server as idUsuario = " +
                                user_data.idUsuario
                        );

                        socketRef.current.on("recieve_notification", (data) => {
                            const { senderUserId, type } = data;
                            console.log(
                                `Tiene una nueva notificacion de ${senderUserId}, relistando notificaciones`
                            );
                            toast.message("Nueva notificación", {
                                description:
                                    "Revisa tu bandeja de notificaciones",
                            });
                            fetchNotifications(user_data);
                        });

                        socketRef.current.on("relist_notification", (data) => {
                            fetchNotifications(user_data);
                        });

                        socketRef.current.on("private_message", (data) => {
                            const { senderUserId, message } = data;
                            console.log(
                                `Received private message from user ${senderUserId}: ${message}`
                            );
                        });

                        setIsLoading(false);

                        return () => {
                            socketRef.current.disconnect();
                        };
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    function fetchNotifications(userData) {
        const notisURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/usuario/listarNotificaciones";

        console.log(userData);
        axios
            .post(notisURL, { idUsuario: userData.idUsuario })
            .then(function (response) {
                console.log(response);
                setNotifications(response.data.notificaciones);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async function sendNotification(idDestinatario, tipo, idLineaAsociada) {
        try {
            const newURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/usuario/enviarNotificacion";

            const newNotifResponse = await axios.post(newURL, {
                idUsuario: idDestinatario,
                tipo: tipo,
                idLineaAsociada: idLineaAsociada,
            });

            const targetUserId = idDestinatario; // Replace with the actual target user's idUsuario

            socketRef.current.emit("send_notification", {
                targetUserId,
            });

            console.log("Se envion notificacion");
        } catch (error) {
            console.error("Error al enviar notificacion: ", error);
        }
    }

    async function sendNotificationOnlySocket(idDestinatario) {
        try {
            const targetUserId = idDestinatario; // Replace with the actual target user's idUsuario

            socketRef.current.emit("send_notification", {
                targetUserId,
            });
        } catch (error) {
            console.error("Error al enviar notificacion: ", error);
        }
    }

    async function relistNotification(idDestinatario) {
        try {
            const targetUserId = idDestinatario; // Replace with the actual target user's idUsuario

            socketRef.current.emit("send_relist_notification", {
                targetUserId,
            });

            console.log("Se envio relistar notificacion");
        } catch (error) {
            console.error("Error al enviar relistar notificacion: ", error);
        }
    }

    function handleDeleteNotification(idNotificacion) {
        console.log("Eliminando notificacion de id " + idNotificacion);

        const deleteNotifURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/usuario/modificaEstadoNotificacionXIdNotificacion";

        axios
            .post(deleteNotifURL, {
                idNotificacion: idNotificacion,
                estado: 0,
            })
            .then(function (response) {
                console.log(response.data.message);
                const newNotifsArray = notifications.filter(
                    (notif) => notif.idNotificacion !== idNotificacion
                );
                setNotifications(newNotifsArray);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const [notifsTabIsLoading, setNotifsTabIsLoading] = useState(false);

    function handleModifyAllNotifications(estado) {
        console.log("modifying notifications with state " + estado);
        setNotifsTabIsLoading(true);
        const deleteNotifURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/usuario/modificaEstadoNotificacionXIdUsuario";

        axios
            .post(deleteNotifURL, {
                idUsuario: sessionData.idUsuario,
                estado: estado,
            })
            .then(function (response) {
                console.log(response.data.message);
                console.log(
                    "ARREGLO DE NOTIFICACIONES " +
                        JSON.stringify(response.data.notificaciones, null, 2)
                );
                setNotifications(response.data.notificaciones);
                setNotifsTabIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    if (isLoading) {
        return (
            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        );
    } else {
        return (
            <SessionContext.Provider value={{ sessionData, setSession }}>
                <NotificationsContext.Provider
                    value={{
                        notifications,
                        setNotifications,
                        sendNotification,
                        sendNotificationOnlySocket,
                        relistNotification,
                    }}
                >
                    <>
                        <div
                            className="dashboardLayout"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100vh",
                            }}
                        >
                            <DashboardNav
                                userName={sessionData.nombres}
                                userLastName={sessionData.apellidos}
                                userObj={sessionData}
                                handleDeleteNotification={(idNotif) => {
                                    handleDeleteNotification(idNotif);
                                }}
                                handleModifyAllNotifications={(state) => {
                                    handleModifyAllNotifications(state);
                                }}
                                notifsTabIsLoading={notifsTabIsLoading}
                            />
                            <DashboardSecondNav />
                            <div
                                style={{
                                    marginTop: "123px",
                                    flex: "1",
                                    overflow: "auto",
                                    display: "flex",
                                }}
                                className="bg-mainContent"
                            >
                                {sessionData !== null && children}
                            </div>
                        </div>
                        <Toaster
                            richColors
                            theme={"light"}
                            closeButton={true}
                        ></Toaster>
                    </>
                </NotificationsContext.Provider>
            </SessionContext.Provider>
        );
    }
}
