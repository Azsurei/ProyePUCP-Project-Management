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

axios.defaults.withCredentials = true;

function Login() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [usuario, setUsuario] = useState("");
    const [passwordError, setPasswordError] = useState(false);

    const axiosOptions = {
        method: "post", // El método de solicitud puede variar según tus necesidades
        url: "http://localhost:8080/api/auth/login",
        headers: {
            "Content-Type": "application/json",
        },
        // Otros parámetros de la solicitud, como los datos JSON, deben agregarse aquí
    };

    function handleChange(name, value) {
        if (name === "correo") {
            setUsuario(value);
        } else {
            if (value.length < 3) {
                setPasswordError(true);
            } else {
                setPasswordError(false);
                setPassword(value);
            }
        }
    }

    function handleLogin() {
        console.log(usuario);
        console.log(password);

        axios
            .post("http://localhost:8080/api/auth/login", {
                username: usuario,
                password: password,
            })
            .then(function (response) {
                console.log(response);
                console.log("Conexion correcta");

                // const token = response.token;
                // if(token){
                //     //const json = jwt.decode(token) as {}; DEBEMOS SACAR EL ID A PARTIR DE EL TOKEN
                // }

                //tenemos que mandarlo a su dashboard
                router.push('/dashboard');

            })
            .catch(function (error) {
                console.log(error);
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
                                    id: "correo",
                                    name: "correo",
                                    type: "text",
                                    placeholder: "Correo electrónico",
                                }}
                                handleChange={handleChange}
                            />

                            <Placeholder
                                attribute={{
                                    id: "contrasena",
                                    name: "contrasena",
                                    type: "password",
                                    placeholder: "Contraseña",
                                }}
                                handleChange={handleChange}
                                param={passwordError}
                            />
                            {passwordError && (
                                <label className="label-error">
                                    Contraseña inválida o incompleta
                                </label>
                            )}
                        </div>

                        <div className="divInicioSesion">
                            <Link
                                href="/login/recoverPassword"
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
                            />
                        </div>

                        <div className="container">
                            <div className="line"></div>
                            <div className="greeting">O inicia sesión con</div>
                            <div className="line"></div>
                        </div>

                        <div className="boton2">
                            <Button text="Google" href={"#"} />
                        </div>

                        <div className="contenedorPrincipal">
                            <div className="sinCuenta">
                                <p className="txtsinCuenta">
                                    ¿No tienes Cuenta?
                                </p>
                            </div>
                            <div className="divRegistrate">
                                <Link
                                    href="/login/register"
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
