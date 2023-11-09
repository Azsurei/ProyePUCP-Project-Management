"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";

import Link from "next/link";
import { Input, Card, CardBody } from "@nextui-org/react";
import Button from "@/components/Button";

import { EyeFilledIcon } from "@/../public/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/../public/icons/EyeSlashFilledIcon";

axios.defaults.withCredentials = true;

// Funciones de API
const verifyEmail = async (email) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/auth/verificarSiCorreoEsDeGoogle`,
                {
                    correoElectronico: email
                }
            )
            .then((response) => {
                console.log(response);
                resolve(response.data.tieneCuentaGoogle);
            })
            .catch((error) => {
                console.error(
                    "Error al verificar si el correo es de Google: ",
                    error
                );
                reject(error.message);
            });
    });
};
const resetPassword = async (email, password) => {
    return new Promise((resolve, reject) => {
        axios
            .put(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/usuario/cambiarPassword`,
                {
                    correoElectronico: email,
                    password: password,
                }
            )
            .then((response) => {
                console.log(response);
                resolve();
            })
            .catch((error) => {
                console.error(
                    "Error al realizar el cambio de contraseña: ",
                    error
                );
                reject(error.response.data);
            });
    });
};

// Componente general
export default function recoverPassword() {
    // Variables de información
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRep, setPasswordRep] = useState("");

    // Variables de formuario
    const [typeForm, setTypeForm] = useState("recover");
    const [statusFormRecover, setStatusFormRecover] = useState("init");
    const [statusFormReset, setStatusFormReset] = useState("init");
    const [errorForm, setErrorForm] = useState(null);

    // Variables de visibilidad
    const [isVisible, setIsVisible] = useState(false);

    // Funciones principales
    const handleVerify = async () => {
        setStatusFormRecover("submitting");
        try {
            const response = await verifyEmail(email);
            if (response) {
                setTypeForm("reset");
            } else {
                setErrorForm(
                    "El correo el cual intenta realizar la recuperación está registrado con Google. Por favor, inicie sesión con Google."
                );
            }
        } catch (error) {
            setErrorForm(error);
        } finally {
            setStatusFormRecover("valid");
        }
    };
    const handleRecover = async () => {
        setStatusFormReset("submitting");
        try {
            await resetPassword(email, password);
            setTypeForm("success");
        } catch (error) {
            setErrorForm(error);
        } finally {
            setStatusFormReset("valid");
        }
    };
    const returnForm = () => {
        setPassword("");
        setPasswordRep("");
        setTypeForm("recover");
    };

    // Funciones auxiliares
    const toggleVisibility = () => setIsVisible(!isVisible);
    const validateEmail = (email) =>
        email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    const validatePassword = (password) => password.length >= 5;
    const emailInvalid = useMemo(() => {
        if (email === "") return false;
        return validateEmail(email) ? false : true;
    }, [email]);
    const passwordInvalid = useMemo(() => {
        if (password === "") return false;
        return validatePassword(password) ? false : true;
    }, [password]);
    const passwordRepInvalid = useMemo(() => {
        if (passwordRep === "") return false;
        return password === passwordRep ? false : true;
    }, [password, passwordRep]);

    // Funciones de renderizado y efectos
    useEffect(() => {
        if (statusFormRecover === "submitting") {
            setErrorForm(null);
        }
    }, [statusFormRecover]);
    useEffect(() => {
        if (!emailInvalid && email !== "") setStatusFormRecover("valid");
        else setStatusFormRecover("init");
    }, [email, emailInvalid]);
    useEffect(() => {
        if (statusFormReset === "submitting") {
            setErrorForm(null);
        }
    }, [statusFormReset]);
    useEffect(() => {
        if (
            !passwordInvalid &&
            !passwordRepInvalid &&
            password !== "" &&
            passwordRep !== ""
        )
            setStatusFormReset("valid");
        else setStatusFormReset("init");
    }, [password, passwordRep, passwordInvalid, passwordRepInvalid]);

    return (
        <>
            {typeForm === "recover" && (
                <>
                    <p className="flex flex-col items-center font-['Montserrat'] font-medium text-4xl">
                        <span>Recuperación de</span>
                        <span>contraseña</span>
                    </p>
                    <p className="flex flex-col items-center font-['Roboto'] font-normal text-xl">
                        <span className="text-default-500 text-center">
                            Ingresa tu correo electrónico para recuperar tu
                            contraseña
                        </span>
                    </p>
                    <div className="flex flex-col items-center w-full gap-4">
                        {errorForm && (
                            <Card className="bg-[#FFA00A] text-white">
                                <CardBody>
                                    <p>{errorForm}</p>
                                </CardBody>
                            </Card>
                        )}
                        <Input
                            value={email}
                            type="text"
                            label="Correo electrónico"
                            size="md"
                            variant="bordered"
                            radius="sm"
                            fullWidth={true}
                            isInvalid={emailInvalid}
                            color={emailInvalid ? "danger" : "default"}
                            errorMessage={
                                emailInvalid
                                    ? "Correo electrónico inválido"
                                    : ""
                            }
                            onValueChange={setEmail}
                            isClearable
                            className="font-['Roboto']"
                        />
                        <Button
                            type="submit"
                            text="Verificar correo"
                            onClick={handleVerify}
                            isLoading={statusFormRecover === "submitting"}
                            isDisabled={
                                statusFormRecover === "init" ||
                                statusFormRecover === "submitting"
                            }
                            className={"w-48"}
                        />
                        <div className="flex flex-wrap justify-between items-center gap-2 mt-4 w-full content-center">
                            <span className="font-['Roboto']">
                                ¿Tienes una cuenta?
                            </span>
                            <Link href="/login">
                                <span className="font-['Roboto'] text-md font-bold leading-12 text-[#3F57A1] hover:text-[#2A3F80] active:text-[#1E2A32] no-underline">
                                    Iniciar sesión
                                </span>
                            </Link>
                        </div>
                    </div>
                </>
            )}
            {typeForm === "reset" && (
                <>
                    <p className="flex flex-col items-center font-['Montserrat'] font-medium text-4xl">
                        <span>Recuperación de</span>
                        <span>contraseña</span>
                    </p>
                    <p className="flex flex-col items-center font-['Roboto'] font-normal text-xl">
                        <span className="text-default-500 text-center">
                            Ingresa y confirma la nueva contraseña para la
                            cuenta asociada al correo electrónico
                        </span>
                    </p>
                    <div className="flex flex-col items-center w-full gap-4">
                        {errorForm && (
                            <Card className="bg-[#FFA00A] text-white">
                                <CardBody>
                                    <p>{errorForm}</p>
                                </CardBody>
                            </Card>
                        )}
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
                        <Input
                            value={passwordRep}
                            type={"password"}
                            label="Confirmar contraseña"
                            size="md"
                            variant="bordered"
                            radius="sm"
                            fullWidth={true}
                            isInvalid={passwordRepInvalid}
                            color={passwordRepInvalid ? "danger" : "default"}
                            errorMessage={
                                passwordRepInvalid
                                    ? "Las contraseñas no coinciden"
                                    : ""
                            }
                            onValueChange={setPasswordRep}
                            className="font-['Roboto']"
                        />
                        <Button
                            type="submit"
                            text="Recuperar contraseña"
                            onClick={handleRecover}
                            isLoading={statusFormReset === "submitting"}
                            isDisabled={
                                statusFormReset === "init" ||
                                statusFormReset === "submitting"
                            }
                            className={"w-48"}
                        />
                        <div className="flex flex-wrap justify-between items-center gap-2 mt-4 w-full content-center">
                            <span
                                className="font-['Roboto'] text-md font-bold leading-12 text-[#3F57A1] hover:text-[#2A3F80] active:text-[#1E2A32] no-underline"
                                onClick={returnForm}
                            >
                                Volver a verificación de correo
                            </span>
                        </div>
                    </div>
                </>
            )}
            {typeForm === "success" && (
                <>
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <p className="font-['Montserrat'] font-medium text-4xl">
                            Contraseña cambiada
                        </p>
                        <p className="font-['Roboto'] font-normal text-xl">
                            Se ha realizado la recuperación de contraseña para
                            el correo asociado
                        </p>
                    </div>
                    <div className="w-full h-0.5 rounded-2xl bg-gray-300"></div>
                    <Link href="/login">
                        <span className="font-['Roboto'] text-md font-bold leading-12 text-[#3F57A1] hover:text-[#2A3F80] active:text-[#1E2A32] no-underline">
                            Regresar a inicio de sesión
                        </span>
                    </Link>
                </>
            )}
        </>
    );
}
