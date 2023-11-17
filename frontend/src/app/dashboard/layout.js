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
                        socketRef.current = io("http://localhost:8080", {
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
                                description: "Revisa tu bandeja de notificaciones",
                            });
                            fetchNotifications(user_data);
                        });

                        socketRef.current.on("relist_notification", (data) => {
                            fetchNotifications(user_data);
                        })

                        socketRef.current.on("private_message", (data) => {
                            const { senderUserId, message } = data;
                            console.log(
                                `Received private message from user ${senderUserId}: ${message}`
                            );
                        });

                        setIsLoading(false);

                        return () => {
                            socket.disconnect();
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

    //PROBLEMA CON LOADING SCREENS. al tratar de hacer su uso modular, puede que ocurra
    //que esta se apage, y la del hijo en {children} se prende consecuentemente por su renderizado
    //provocando un efecto de recarga VISIBLE en el loading screen (se nota en la barrita animada)

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
                        relistNotification
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
                        <Toaster richColors></Toaster>
                    </>
                </NotificationsContext.Provider>
            </SessionContext.Provider>
        );
    }
}
