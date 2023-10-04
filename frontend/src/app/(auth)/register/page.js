"use client";

import Button from "@/components/Button";
import Placeholder from "@/components/Placeholder";
import "@/styles/resetPassword.css";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";

function register() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correoElectronico, setCorreoElectronico] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepe, setpasswordRepe] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorRepe, setPasswordErrorRepe] = useState(false);
    const [tocoSegundoPassword, setTocoSegundoPassword] = useState(false);
    let passwordIguales = false;

    const axiosOptions = {
        method: "post", // El método de solicitud puede variar según tus necesidades
        url: "http://localhost:8080/api/auth/register",
        headers: {
            "Content-Type": "application/json",
        },
        // Otros parámetros de la solicitud, como los datos JSON, deben agregarse aquí
    };

    function handleChange(name, value) {
        if (name === "nombre") setNombre(value);
        else if (name === "apellido") setApellido(value);
        else if (name === "correoElectronico") setCorreoElectronico(value);
        if (name === "contraseña") {
            setPassword(value);
            if (value.length < 3) {
                setPasswordError(true);
            } else {
                setPasswordError(false);
            }
        } else {
            setTocoSegundoPassword(true);
            setpasswordRepe(value);
            if (value.length < 3) {
                setPasswordErrorRepe(true);
            } else {
                setPasswordErrorRepe(false);
            }
        }
    }

    function handleRegister() {
        console.log(nombre);
        console.log(apellido);
        console.log(correoElectronico);
        console.log(password);

        axios
            .post("http://localhost:8080/api/auth/register", {
                nombres: nombre,
                apellidos: apellido,
                correoElectronico: correoElectronico,
                password: password,
            })
            .then(function (response) {
                console.log(response);
                console.log("Registro correcto");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <>
            <div className="cabecera">
                <div className="contenedor-nueva-contraseña">
                    <span>Regístrate</span>
                </div>
                <div className="contenedor-ingresar-contraseña">
                    ¡Crea tu cuenta!
                </div>
            </div>
            <div className="cuerpo">
                <div className="placeholders">
                    <Placeholder
                        attribute={{
                            id: "nombre",
                            name: "nombre",
                            type: "text",
                            placeholder: "Nombre",
                        }}
                        handleChange={handleChange}
                    />
                    <Placeholder
                        attribute={{
                            id: "apellido",
                            name: "apellido",
                            type: "text",
                            placeholder: "Apellido",
                        }}
                        handleChange={handleChange}
                    />
                    <Placeholder
                        attribute={{
                            id: "correoElectronico",
                            name: "correoElectronico",
                            type: "text",
                            placeholder: "Correo Electrónico",
                        }}
                        handleChange={handleChange}
                    />
                    <Placeholder
                        attribute={{
                            id: "contraseña",
                            name: "contraseña",
                            type: "password",
                            placeholder: "Nueva contraseña",
                        }}
                        handleChange={handleChange}
                        param={passwordError}
                    />
                    {passwordError && (
                        <label className="label-error">
                            Contraseña inválida o incompleta
                        </label>
                    )}
                    <Placeholder
                        attribute={{
                            id: "contraseñaConfimar",
                            name: "contraseñaConfimar",
                            type: "password",
                            placeholder: "Confirmar contraseña",
                        }}
                        handleChange={handleChange}
                        param={passwordErrorRepe}
                    />
                    {passwordErrorRepe && (
                        <label className="label-error">
                            Contraseña inválida o incompleta
                        </label>
                    )}
                    {password !== passwordRepe &&
                        !passwordErrorRepe &&
                        tocoSegundoPassword && (
                            <label className="label-error">
                                Las contraseñas no son iguales
                            </label>
                        )}
                </div>
                <div className="boton">
                    <Button
                        text="Registrarse"
                        href={"#"}
                        onClick={handleRegister}
                    />
                </div>
                <div className="otros-login">
                    <div className="roboto">¿Tienes un cuenta?</div>
                    <div>
                        <Link href="/login">
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

export default register;
