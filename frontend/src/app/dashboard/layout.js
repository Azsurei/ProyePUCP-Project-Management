"use client";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import DashboardNav from "@/components/dashboardComps/DashboardNav";
import DashboardSecondNav from "@/components/dashboardComps/DashboardSecondNav";
import { createContext, useEffect, useState } from "react";

import axios from "axios";
axios.defaults.withCredentials = true;

export const SessionContext = createContext();

export default function RootLayout({ children }) {
    const [sessionData, setSessionData] = useState({ nombres: "", apellidos: "" });
    const [isLoading, setIsLoading] = useState(true);

    const setSession = (session) => {
        setSessionData(session);
        console.log(session);
    }


    useEffect(() => {
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL + "/api/usuario/verInfoUsuario";

        axios
            .get(stringURL)
            .then(function (response) {
                const user_data = response.data.usuario[0];
                user_data.rolInProject = null;
                user_data.rolNameInProject = null;

                console.log("INFO DEL USUARIO LOGEADO : " + JSON.stringify(user_data));

                setSessionData(user_data);

                setIsLoading(false);
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
            <SessionContext.Provider value={{sessionData, setSession}}>
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
                        {children}
                    </div>
                </div>
            </SessionContext.Provider>
        );
    }
}
