"use client";
import "@/styles/recoverPassword.css";
import "@/styles/resetPassword.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import axios from "axios";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
axios.defaults.withCredentials = true;

export default function RootLayout({ children }) {
    return (
        <div className="App">
            <div>
                <img src="/images/LogoPUCPwhite.png" className="logoPucp"></img>
                <img
                    src="/images/LogoProyePUCPwhite.png"
                    className="logoProyePucp"
                ></img>
            </div>
            <div className="contenedor-principal">{children}</div>
        </div>
    );
}
