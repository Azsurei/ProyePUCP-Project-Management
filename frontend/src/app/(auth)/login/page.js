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
    const [loadingGoogle, setLoadingGoogle] = useState(false);
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

    // // Manejo de envíos de formulario de inicio de sesion
    // useEffect(() => {
    //     if (session) {
    //         Cookies.set("tokenProyePUCP", session.user.token, {
    //             expires: null,
    //         });
    //         router.push("/dashboard");
    //     }
    // }, [session]);

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

            const user = response.data;

            if (user.error) {
                throw user;
            }

            // TODO: Setear en la futura provider context

            router.push("/dashboard");
        } catch (error) {
            setLoginError(
                "Ocurrió un error al iniciar sesión. Intente de nuevo."
            );
            throw error.response.data;
        }

        // const responseNextAuth = await signIn("credentials", {
        //     email,
        //     password,
        //     redirect: false,
        // });

        // if (responseNextAuth.error) {
        //     setStatusForm("valid");
        //     setLoginError("Ocurrion un error al iniciar sesión. Intente de nuevo.");
        //     return;
        // }
    };

    const handleGoogleSignIn = async () => {
        setLoadingGoogle(true);
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
                imgLink: userObject.picture
            })
            .then((response) => {
                const user = response.data;

                if (user.error) {
                    throw user;
                }

                // TODO: Setear en la futura provider context
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
                                        imgLink: userObject.picture
                                    }
                                )
                                .then((response) => {
                                    const user = response.data;

                                    if (user.error) {
                                        throw user;
                                    }

                                    // TODO: Setear en la futura provider context
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

    useEffect(() => {
        google.accounts.id.initialize({
            client_id:
                "152000739309-ljvv04nf75ck9pu4qj1mtf9a15g2kpve.apps.googleusercontent.com",
            callback: handleCallbackResponse,
        });

        google.accounts.id.renderButton(document.getElementById("signInDiv"), {
            theme: "outline",
            size: "large"
        });
    }, []);

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
                <div className="px-4">O inicia sesión con</div>
                <div className="flex-1 h-0.5 rounded-2xl bg-gray-300"></div>
            </div>

            {/* <Button
                text="Google"
                iconBefore={<img src="/icons/icon-google.svg" />}
                isLoading={loadingGoogle}
                isDisabled={loadingGoogle}
                className={"w-48"}
                onClick={() => handleGoogleSignIn()}
            /> */}

            <div id="signInDiv"></div>


            <p className="m-0 p-[.2rem] px-[.5rem] bg-slate-300 rounded-lg" onClick={()=>{
                setEmail("adminLosDibujitos@hotmail.com");
                setPassword("ContraSegura_3526890");
            }}>CUENTA ADMIN</p>

            <div className="flex flex-wrap justify-between items-center gap-2 w-full content-center">
                <Link href="/recoverPassword">
                    <span className="font-['Roboto'] text-md font-bold leading-12 text-[#A9D562] hover:text-[#88B847] active:text-[#507A31] no-underline">
                        ¿Olvidó la contraseña?
                    </span>
                </Link>
                <Link href="/register">
                    <span className="font-['Roboto'] text-md font-bold leading-12 text-[#A9D562] hover:text-[#88B847] active:text-[#507A31] no-underline">
                        Registrate
                    </span>
                </Link>
            </div>
        </>
    );
}

export default Login;
