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
        <div className="w-full h-full overflow-auto bg-[url('/images/LoginBackground.png')] bg-cover bg-top-left flex flex-col justify-start items-center">
            <div className="flex flex-col items-center sm:justify-between sm:flex-row w-full h-auto mb-4">
                <img
                    src="/images/LogoProyePUCPwhite.png"
                    className="w-48 sm:w-auto"
                ></img>
                <img
                    src="/images/LogoPUCPwhite.png"
                    className="w-40 sm:w-auto"
                ></img>
            </div>
            <div className="flex w-full h-full justify-center my-4">
                <div className="flex flex-col items-center gap-6 w-fit h-fit bg-white rounded-2xl p-8 sm:min-w-[24rem] min-w-full max-w-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}
