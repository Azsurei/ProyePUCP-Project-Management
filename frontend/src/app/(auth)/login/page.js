"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

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

axios.defaults.withCredentials = true;

function Login() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const validateEmail = (email) =>
        email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const isInvalid = React.useMemo(() => {
        if (email === "") return false;
        return validateEmail(email) ? false : true;
    }, [email]);

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
        setLoading(true);

        const responseNextAuth = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (responseNextAuth.error) {
            console.log(responseNextAuth.error);
            setLoading(false);
            setLoginError(responseNextAuth.error);
            return;
        }
    };

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
                    isInvalid={isInvalid}
                    color={isInvalid ? "danger" : "default"}
                    errorMessage={
                        isInvalid ? "Correo electrónico inválido" : ""
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
                isLoading={loading}
                className={"w-48"}
            />

            <div className="flex flex-row w-full items-center">
                <div className="flex-1 h-0.5 rounded-2xl bg-gray-300"></div>
                <div className="px-4">O inicia sesión con</div>
                <div className="flex-1 h-0.5 rounded-2xl bg-gray-300"></div>
            </div>

            <Button
                text="Google"
                ic
                iconBefore={<img src="/icons/icon-google.svg" />}
                className={"w-48"}
                onClick={() => handleGoogleSignIn()}
            />

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
