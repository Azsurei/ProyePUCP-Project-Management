import React from "react";
import Card from "@/components/Card";
import TextField from "@/components/TextField";

export default function Templates() {
    return (
        <>
            <div className="flex flex-row space-x-4 mb-4">
                <h2 className="montserrat text-[#172B4D] font-bold text-2xl">
                    Mis plantillas
                </h2>
                <img src="/icons/info-circle.svg" alt="Informacion"></img>
            </div>
            <div className="flex flex-row space-x-4 mb-4 w-full">
                <TextField
                    placeholder="Buscar plantilla"
                    width={400}
                    iconAfter={<img src="/icons/icon-searchBar.svg" />}
                />
            </div>
            <div></div>
        </>
    );
}
