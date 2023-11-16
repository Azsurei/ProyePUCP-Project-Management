"use client";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import DashboardNav from "@/components/dashboardComps/DashboardNav";
import DashboardSecondNav from "@/components/dashboardComps/DashboardSecondNav";
import { createContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import axios from "axios";
axios.defaults.withCredentials = true;

export const SessionContext = createContext();

export default function RootLayout({ children }) {
    const [sessionData, setSessionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const socketRef = useRef(null);

    const setSession = (session) => {
        setSessionData(session);
    };

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
    }, []);

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
                        <p
                            className="bg-red-500 text-white"
                            onClick={() => {
                                console.log("enviando mensaje");
                                const targetUserId = 112; // Replace with the actual target user's idUsuario
                                const message =
                                    "Hello, this is a private message!";

                                // Emit the private message
                                socketRef.current.emit("private_message", {
                                    targetUserId,
                                    message,
                                });
                            }}
                        >
                            Send notif
                        </p>
                        {sessionData !== null && children}
                    </div>
                </div>
            </SessionContext.Provider>
        );
    }
}
