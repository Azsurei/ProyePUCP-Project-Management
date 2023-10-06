"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

import axios from "axios";
import Cookies from 'js-cookie';

import Placeholder from "@/components/Placeholder";
import Button from "@/components/Button";
import "@/styles/login.css";

axios.defaults.withCredentials = true;

function Login() {
    const router = useRouter();
    const { data: session , status } = useSession();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordError: false,
        loading: false,
    });

    function handleChange(name, value) {
        setFormData({
            ...formData,
            [name]: value,
            passwordError: name === "contrasena" && value.length < 3,
        });
    }

    useEffect(() => {
        if (session && status === "authenticated") {
            console.log("Inicio de sesión exitoso.");
            handleSuccessfulLogin();
        }
    }, [session, status]);

    const handleSuccessfulLogin = () => {
        Cookies.set("tokenProyePUCP", session.user.token, { expires: null });
        router.push("/dashboard");
    };

    const handleGoogleSignIn = async () => {
        await signIn("google");
    };

    const handleSubmit = async () => {
        const { email, password } = formData;

        setFormData({ ...formData, loading: true });

        const responseNextAuth = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (responseNextAuth.error) {
            console.log(responseNextAuth.error);
            setFormData({ ...formData, loading: false });
            return;
        }
    };

    // Componente general
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
                                    id: "email",
                                    name: "email",
                                    type: "username",
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
                            <Link href="/recoverPassword" className="txtOlvido">
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
                                type="submit"
                                text="Iniciar Sesión"
                                href={"#"}
                                onClick={handleSubmit}
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
                                onClick={() => handleGoogleSignIn()}
                            />
                        </div>

                        <div className="contenedorPrincipal">
                            <div className="sinCuenta">
                                <p className="txtsinCuenta">
                                    ¿No tienes Cuenta?
                                </p>
                            </div>
                            <div className="divRegistrate">
                                <Link href="/register" className="txtOlvido">
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
