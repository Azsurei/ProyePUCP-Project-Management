"use client";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import DashboardNav from "@/components/dashboardComps/DashboardNav";
import DashboardSecondNav from "@/components/dashboardComps/DashboardSecondNav";
import { createContext, useEffect, useState } from "react";

import axios from "axios";
axios.defaults.withCredentials = true;

export const SessionContext = createContext();

export default function RootLayout({ children }) {
    const [userData, setUserData] = useState({ nombres: "", apellidos: "" });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL + "/api/usuario/verInfoUsuario";

        axios
            .get(stringURL)
            .then(function (response) {
                const user_data = response.data.usuario[0];
                console.log("el nombre del usuario es ", user_data.nombres);
                console.log("el apellido del usuario es ", user_data.apellidos);
                setUserData(user_data);

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
            <SessionContext.Provider value={userData}>
                <div
                    className="dashboardLayout"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <DashboardNav
                        userName={userData.nombres}
                        userLastName={userData.apellidos}
                        userObj={userData}
                    />
                    <DashboardSecondNav />
                    <div
                        style={{
                            marginTop: "123px",
                            flex: "1",
                            overflow: "auto",
                            display: "flex",
                            backgroundColor: "#F5F5F5",
                        }}
                    >
                        {children}
                    </div>
                </div>
            </SessionContext.Provider>
        );
    }
}
