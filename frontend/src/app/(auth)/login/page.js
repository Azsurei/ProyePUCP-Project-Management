"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import Placeholder from "@/components/Placeholder";
import Button from "@/components/Button";
import "@/styles/login.css";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';

axios.defaults.withCredentials = true;

function Login() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        usuario: "",
        password: "",
        passwordError: false,
        loading: false,
    });

    const axiosOptions = {
        method: "post", // El método de solicitud puede variar según tus necesidades
        url: "http://localhost:8080/api/auth/login",
        headers: {
            "Content-Type": "application/json",
        },
        // Otros parámetros de la solicitud, como los datos JSON, deben agregarse aquí
    };

    function handleChange(name, value) {
        setFormData({
            ...formData,
            [name]: value,
            passwordError: name === "contrasena" && value.length < 3,
        });
    }

    function handleLogin() {
        const { usuario, password } = formData;

        // Activar el estado de carga antes de realizar la solicitud Axios
        setFormData({ ...formData, loading: true });
        console.log(formData);


        axios
            .post("http://localhost:8080/api/auth/login", {
                username: usuario,
                password: password,
            })
            .then(function (response) {
                console.log(response);
                console.log("Conexion correcta");

                router.push("/dashboard");
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(() => {
                // Desactivar el estado de carga después de que la solicitud se complete (ya sea con éxito o error)
                setFormData({ ...formData, loading: false });
            });
    }

    return (
        <>
            <div className="Fondo">
                <div>
                    <img
                        src="/images/LogoPUCPwhite.png"
                        className="logoPucp"
                    ></img>
                </div>

                <div>
                    <img
                        src="/images/LogoProyePUCPwhite.png"
                        className="logoProyePucp"
                    ></img>
                </div>

                <div className="CuadroLogin">
                    <div>
                        <p className="txtInicio">
                            <span>Inicio de</span>sesión
                        </p>

                        <div className="placeholders">
                            <Placeholder
                                attribute={{
                                    id: "usuario",
                                    name: "usuario",
                                    type: "text",
                                    placeholder: "Correo electrónico",
                                }}
                                handleChange={handleChange}
                            />

                            <Placeholder
                                attribute={{
                                    id: "password",
                                    name: "password",
                                    type: "password",
                                    placeholder: "Contraseña",
                                }}
                                handleChange={handleChange}
                                param={formData.passwordError}
                            />
                            {formData.passwordError && (
                                <label className="label-error">
                                    Contraseña inválida o incompleta
                                </label>
                            )}
                        </div>

                        <div className="divInicioSesion">
                            <Link
                                href="/recoverPassword"
                                className="txtOlvido"
                            >
                                <span
                                    href="#IniciarSesion"
                                    className="txtOlvido"
                                >
                                    ¿Olvidó la contraseña?
                                </span>
                            </Link>
                        </div>

                        <div className="boton2">
                            <Button
                                text="Iniciar Sesión"
                                href={"#"}
                                onClick={handleLogin}
                                isLoading={formData.loading}
                                className={"w-48"}
                            />
                        </div>

                        <div className="container">
                            <div className="line"></div>
                            <div className="greeting">O inicia sesión con</div>
                            <div className="line"></div>
                        </div>

                        <div className="boton2">
                            <Button
                                text="Google"
                                iconBefore={
                                    <img src="/icons/icon-google.svg" />
                                }
                                className={"w-48"}
                                onClick={() => signIn()}
                            />
                        </div>

                        <div className="contenedorPrincipal">
                            <div className="sinCuenta">
                                <p className="txtsinCuenta">
                                    ¿No tienes Cuenta?
                                </p>
                            </div>
                            <div className="divRegistrate">
                                <Link
                                    href="/register"
                                    className="txtOlvido"
                                >
                                    <span className="txtRegistrate">
                                        Registrate
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
