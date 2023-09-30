"use client";

import React from "react";
import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import Button from "@/components/Button";

import "@/styles/recoverPassword.css";

function recoverPassword() {
    return (
        <>
            <div className="cabecera">
                <div className="contenedor-nueva-contraseña">
                    <span>¿Olvidaste tu</span>contraseña?
                </div>
                <div className="contenedor-ingresar-contraseña">
                    Ingrese su correo electrónico para restablecer la contraseña
                </div>
            </div>
            <div className="cuerpo">
                <div className="placeholders">
                    <Placeholder
                        attribute={{
                            id: "correo",
                            name: "correo",
                            type: "text",
                            placeholder: "Correo electrónico",
                        }}
                    />
                </div>
                <div className="boton">
                    <Button text="Continuar" href={"/login/resetPassword"} />
                </div>
                <div className="otros-login">
                    <div className="roboto">¿Tienes un cuenta?</div>
                    <div>
                        <Link href="/login/login">
                            <span className="iniciar-sesion roboto">
                                Iniciar sesión
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default recoverPassword;
