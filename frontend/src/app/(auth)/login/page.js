"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import Cookies from "js-cookie";

import Button from "@/components/Button";
import {
    Input,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@nextui-org/react";

import { EyeFilledIcon } from "@/../public/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/../public/icons/EyeSlashFilledIcon";
import jwtDecode from "jwt-decode";

axios.defaults.withCredentials = true;

function Login() {
    // Variables de importaciones
    const router = useRouter();

    // Variables de formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [statusForm, setStatusForm] = useState("init");
    const [loadingCred, setLoadingCred] = useState(false);
    const [loginError, setLoginError] = useState(null);

    // Variables adicionales
    const [isVisible, setIsVisible] = useState(false);

    // Funciones adicionales
    const toggleVisibility = () => setIsVisible(!isVisible);
    const validateEmail = (email) =>
        email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    const validatePassword = (password) => password.length >= 5;

    // Control de flujo de variables de formulario
    const emailInvalid = React.useMemo(() => {
        if (email === "") return false;
        return validateEmail(email) ? false : true;
    }, [email]);

    const passwordInvalid = React.useMemo(() => {
        if (password === "") return false;
        return validatePassword(password) ? false : true;
    }, [password]);

    // Control de flujo del estado general del formulario
    useEffect(() => {
        if (statusForm === "init" || statusForm === "valid") {
            setLoadingCred(false);
        } else if (statusForm === "submitting") {
            setLoadingCred(true);
            setLoginError(null);
        }
    }, [statusForm]);

    useEffect(() => {
        if (
            emailInvalid ||
            passwordInvalid ||
            email === "" ||
            password === ""
        ) {
            setStatusForm("init");
        } else {
            setStatusForm("valid");
        }
    }, [email, password]);

    const handleSubmit = async () => {
        setStatusForm("submitting");
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
                {
                    username: email,
                    password: password,
                }
            );
            router.push("/dashboard");
        } catch (error) {
            setLoginError(error.response.data);
            setStatusForm("valid");
        }
    };

    const handleCallbackResponse = (response) => {
        console.log(response);
        const userObject = jwtDecode(response.credential);
        console.log(userObject);

        //aqui ya tenemos correoElectronico y contra (sub). tambien given_name y family_name
        axios
            .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/loginImg`, {
                username: userObject.email,
                password: userObject.sub, //consideramos al sub (id) como contraseña en bd
                imgLink: userObject.picture,
            })
            .then((response) => {
                router.push("/dashboard");
            })
            .catch(function (error) {
                console.log("Error al verificar cuenta en bd", error);

                if (error.response.status === 417) {
                    //handleamos caso en que usuario no existe en bd para registrarlo automaticamente
                    axios
                        .post(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
                            {
                                nombres: userObject.given_name,
                                apellidos: userObject.family_name,
                                correoElectronico: userObject.email,
                                password: userObject.sub,
                                tieneCuentaGoogle: true,
                            }
                        )
                        .then((response) => {
                            //usuario registrado, ahora lo logeamos con el login
                            console.log(response.data.message);

                            axios
                                .post(
                                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/loginImg`,
                                    {
                                        username: userObject.email,
                                        password: userObject.sub,
                                        imgLink: userObject.picture,
                                    }
                                )
                                .then((response) => {
                                    router.push("/dashboard");
                                })
                                .catch(function (error) {
                                    console.log(
                                        "Error al verificar cuenta en bd LUEGO de registrar por primera vez",
                                        error
                                    );
                                });
                        })
                        .catch(function (error) {
                            console.log(
                                "Error al registrar cuenta en bd",
                                error
                            );
                        });
                }
            });
    };

    // useEffect(() => {
    //     google.accounts.id.initialize({
    //         client_id:
    //             "152000739309-ljvv04nf75ck9pu4qj1mtf9a15g2kpve.apps.googleusercontent.com",
    //         callback: handleCallbackResponse,
    //     });

    //     google.accounts.id.renderButton(document.getElementById("signInDiv"), {
    //         theme: "outline",
    //         size: "large",
    //     });
    // }, []);

    // Componente general
    return (
        <>
            <p className="flex flex-col items-center font-['Montserrat'] font-medium text-4xl">
                <span>Inicio de</span>
                <span>sesión</span>
            </p>
            <div className="flex flex-col items-center w-full gap-4">
                {loginError && (
                    <Card className="bg-[#FFA00A] text-white">
                        <CardBody>
                            <p>{loginError}</p>
                        </CardBody>
                    </Card>
                )}
                <Input
                    value={email}
                    type="email"
                    label="Correo electrónico"
                    size="md"
                    variant="bordered"
                    radius="sm"
                    fullWidth={true}
                    isInvalid={emailInvalid}
                    color={emailInvalid ? "danger" : "default"}
                    errorMessage={
                        emailInvalid ? "Correo electrónico inválido" : ""
                    }
                    onValueChange={setEmail}
                    isClearable
                    className="font-['Roboto']"
                />
                <Input
                    value={password}
                    type={isVisible ? "text" : "password"}
                    label="Contraseña"
                    size="md"
                    variant="bordered"
                    radius="sm"
                    fullWidth={true}
                    isInvalid={passwordInvalid}
                    color={passwordInvalid ? "danger" : "default"}
                    errorMessage={
                        passwordInvalid
                            ? "La contraseña debe tener 5 caracteres o más"
                            : ""
                    }
                    onValueChange={setPassword}
                    endContent={
                        <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                        >
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    className="font-['Roboto']"
                />
            </div>

            <Button
                type="submit"
                text="Iniciar Sesión"
                href={"#"}
                onClick={handleSubmit}
                isLoading={loadingCred}
                isDisabled={
                    loadingCred ||
                    statusForm === "init" ||
                    statusForm === "submitting"
                }
                className={"w-48"}
            />

            <div className="flex flex-row w-full items-center">
                <div className="flex-1 h-0.5 rounded-2xl bg-gray-300"></div>
                <div className="font-['Roboto'] font-normal text-md px-4">O inicia sesión con</div>
                <div className="flex-1 h-0.5 rounded-2xl bg-gray-300"></div>
            </div>

            <div id="signInDiv"></div>

            <Button
                type="text"
                text="Administrador"
                href={"#"}
                onClick={() => {
                    setEmail("adminLosDibujitos@hotmail.com");
                    setPassword("ContraSegura_3526890");
                }}
                isDisabled={statusForm === "submitting"}
                className={"w-48"}
            />

            <div className="flex flex-wrap justify-between items-center gap-2 w-full content-center">
                <Link href="/recoverPassword">
                    <span className="font-['Roboto'] text-md font-bold leading-12 text-[#3F57A1] hover:text-[#2A3F80] active:text-[#1E2A32] no-underline">
                        ¿Olvidó la contraseña?
                    </span>
                </Link> 
                <Link href="/register">
                    <span className="font-['Roboto'] text-md font-bold leading-12 text-[#3F57A1] hover:text-[#2A3F80] active:text-[#1E2A32] no-underline">
                        Regístrate
                    </span>
                </Link>
            </div>
        </>
    );
}

export default Login;
