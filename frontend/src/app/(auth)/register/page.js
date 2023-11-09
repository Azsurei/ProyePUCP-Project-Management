"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import jwtDecode from "jwt-decode";

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

function Register() {
    // Variables de importaciones
    const router = useRouter();

    // Variables de formulario
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRep, setPasswordRep] = useState("");
    const [statusForm, setStatusForm] = useState("init"); // init, valid, submitting, success
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [registerError, setRegisterError] = useState(null);

    // Variables adicionales
    const [isVisible, setIsVisible] = useState(false);

    // Funciones auxiliares
    const toggleVisibility = () => setIsVisible(!isVisible);
    const validateEmail = (email) =>
        email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    const validatePassword = (password) => password.length >= 5;

    // Control de flujo de variables de formulario
    const nombreInvalid = React.useMemo(() => {
        if (nombre === "") return false;
        return nombre.length >= 3 ? false : true;
    }, [nombre]);

    const apellidoInvalid = React.useMemo(() => {
        if (apellido === "") return false;
        return apellido.length >= 3 ? false : true;
    }, [apellido]);

    const emailInvalid = React.useMemo(() => {
        if (email === "") return false;
        return validateEmail(email) ? false : true;
    }, [email]);

    const passwordInvalid = React.useMemo(() => {
        if (password === "") return false;
        return validatePassword(password) ? false : true;
    }, [password]);

    const passwordRepInvalid = React.useMemo(() => {
        if (passwordRep === "") return false;
        return password === passwordRep ? false : true;
    }, [password, passwordRep]);

    // Control de flujo del estado general del formulario
    useEffect(() => {
        if (statusForm === "init" || statusForm === "valid") {
            setLoadingRegister(false);
        } else if (statusForm === "submitting") {
            setLoadingRegister(true);
            setRegisterError(null);
        }
    }, [statusForm]);

    useEffect(() => {
        if (
            nombreInvalid ||
            apellidoInvalid ||
            emailInvalid ||
            passwordInvalid ||
            passwordRepInvalid ||
            nombre === "" ||
            apellido === "" ||
            email === "" ||
            password === "" ||
            passwordRep === ""
        ) {
            setStatusForm("init");
        } else {
            setStatusForm("valid");
        }
    }, [nombre, apellido, email, password, passwordRep]);

    // Funciones de formulario
    const handleRegister = async () => {
        setStatusForm("submitting");
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
                {
                    nombres: nombre,
                    apellidos: apellido,
                    correoElectronico: email,
                    password: password,
                    tieneCuentaGoogle: false,
                }
            );
            setStatusForm("success");
        } catch (error) {
            setRegisterError(error.response.data);
            setStatusForm("valid");
        }
    };

    console.log(statusForm);

    // Componente
    return (
        <>
            {statusForm === "success" && (
                <>
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <p className="font-['Montserrat'] font-medium text-4xl text-center">
                            Cuenta registrada
                        </p>
                        <p className="font-['Roboto'] font-normal text-xl text-center">
                            Se ha creado la cuenta exitosamente
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
            {statusForm !== "success" && (
                <>
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <p className="font-['Montserrat'] font-medium text-4xl">
                            Regístrate
                        </p>
                        <p className="font-['Roboto'] text-default-500 font-normal text-xl">
                            ¡Crea una cuenta!
                        </p>
                    </div>

                    <div className="flex flex-col items-center w-full gap-4">
                        {registerError && (
                            <Card className="bg-[#FFA00A] text-white">
                                <CardBody>
                                    <p>{registerError}</p>
                                </CardBody>
                            </Card>
                        )}
                        <Input
                            value={nombre}
                            type="text"
                            label="Nombres"
                            size="md"
                            variant="bordered"
                            radius="sm"
                            fullWidth={true}
                            isInvalid={nombreInvalid}
                            color={nombreInvalid ? "danger" : "default"}
                            errorMessage={
                                nombreInvalid ? "Nombre inválido" : ""
                            }
                            onValueChange={setNombre}
                            isClearable
                            className="font-['Roboto']"
                        />
                        <Input
                            value={apellido}
                            type="text"
                            label="Apellidos"
                            size="md"
                            variant="bordered"
                            radius="sm"
                            fullWidth={true}
                            isInvalid={apellidoInvalid}
                            color={apellidoInvalid ? "danger" : "default"}
                            errorMessage={
                                apellidoInvalid ? "Apellido inválido" : ""
                            }
                            onValueChange={setApellido}
                            isClearable
                            className="font-['Roboto']"
                        />
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
                                emailInvalid
                                    ? "Correo electrónico inválido"
                                    : ""
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
                    </div>

                    <Button
                        type="submit"
                        text="Registrarse"
                        href={"#"}
                        onClick={handleRegister}
                        isLoading={loadingRegister}
                        isDisabled={
                            loadingRegister ||
                            statusForm === "init" ||
                            statusForm === "submitting"
                        }
                        className={"w-48"}
                    />

                    <div className="flex flex-wrap justify-between items-center gap-2 w-full content-center">
                        <span className="font-['Roboto']">
                            ¿Tienes una cuenta?
                        </span>
                        <Link href="/login">
                            <span className="font-['Roboto'] text-md font-bold leading-12 text-[#3F57A1] hover:text-[#2A3F80] active:text-[#1E2A32] no-underline">
                                Iniciar sesión
                            </span>
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}

export default Register;
