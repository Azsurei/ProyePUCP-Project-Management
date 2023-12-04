"use client";
import {
    Avatar,
    Button,
    Divider,
    Image,
    Input,
    Textarea,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { SessionContext } from "../../layout";
import axios from "axios";
import { dbDateToInputDate } from "@/common/dateFunctions";
import { toast } from "sonner";
axios.defaults.withCredentials = true;

function EditIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
        </svg>
    );
}

function ProfilePage({ children, params }) {
    const { sessionData, setSession } = useContext(SessionContext);
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const pathname = usePathname();

    const btnStyle =
        " hover:underline  font-medium px-4 py-2 rounded-md cursor-pointer";
    const btnStyleActive =
        "font-medium px-4 py-2 rounded-md bg-[#F4F4F5] dark:bg-[#414141] cursor-pointer";

    const twStyle1 = "hover:underline";

    const baseUrlString =
        "/dashboard/" +
        encodeURIComponent(projectName) +
        "=" +
        encodeURIComponent(projectId) +
        "/perfil";

    const [name, setName] = useState(sessionData.nombres);
    const [lastName, setLastName] = useState(sessionData.apellidos);
    const [mail, setMail] = useState(sessionData.correoElectronico);
    const [birthdate, setBirthdate] = useState(
        dbDateToInputDate(sessionData.fechaNacimiento)
    );
    const [phoneNumber, setPhoneNumber] = useState(sessionData.telefono);

    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="flex flex-row w-full gap-7">
            <div className="flex-1">
                <p className="font-medium text-xl mb-2">Datos principales</p>
                <div className="px-3">
                    <div className="flex flex-row gap-4 w-full">
                        <div className="flex flex-col flex-1">
                            <p>Nombres</p>
                            <Textarea
                                variant="bordered"
                                minRows={1}
                                placeholder="Escribe aqui"
                                value={name}
                                onValueChange={setName}
                            />
                        </div>
                        <div className="flex flex-col flex-1">
                            <p>Apellidos</p>
                            <Textarea
                                variant="bordered"
                                minRows={1}
                                placeholder="Escribe aqui"
                                value={lastName}
                                onValueChange={setLastName}
                            />
                        </div>
                    </div>
                    <p>Correo electrónico</p>
                    <Textarea
                        variant="flat"
                        readOnly
                        minRows={1}
                        placeholder="Escribe aqui"
                        value={mail}
                        onValueChange={setMail}
                    />
                </div>

                <Divider className="my-5" />
                <p className="font-medium text-xl mb-2">Otros datos</p>
                <div className="px-3 flex flex-row gap-4">
                    <div className="flex flex-col flex-1">
                        <p>Fecha de nacimiento</p>
                        <Input
                            type="date"
                            variant="bordered"
                            minRows={1}
                            placeholder="Escribe aqui"
                            value={birthdate}
                            onValueChange={setBirthdate}
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <p>Telefono</p>
                        <Input
                            variant="bordered"
                            minRows={1}
                            placeholder="Escribe aqui"
                            value={phoneNumber}
                            onValueChange={setPhoneNumber}
                        />
                    </div>
                </div>

                <div className="px-4 mt-5 flex w-full justify-end">
                    {(name !== sessionData.nombres ||
                        lastName !== sessionData.apellidos ||
                        mail !== sessionData.correoElectronico ||
                        birthdate !==
                            dbDateToInputDate(sessionData.fechaNacimiento) ||
                        phoneNumber !== sessionData.telefono) && (
                        <Button
                            color="success"
                            isLoading={isLoading}
                            className=" bg-generalBlue text-white font-medium"
                            onPress={async () => {
                                setIsLoading(true);
                                await updateUserData();
                            }}
                        >
                            Actualizar perfil
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2 items-center">
                <Image
                    src={sessionData.imgLink}
                    width={200}
                    className="border-2 rounded-full border-slate-400 dark:border-slate-100 shadow-lg"
                />
            </div>
        </div>
    );

    async function updateUserData() {
        console.log("actualizar perfil");
        const putData = {
            idUsuario: sessionData.idUsuario,
            nombres: name,
            apellidos: lastName,
            correoElectronico: mail,
            fechaNacimiento: birthdate,
            telefono: phoneNumber,
            usuario: "",
        };

        console.log("Put data", putData);

        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL + "/api/auth/modificarUsuario";

        try {
            const response = await axios.put(stringURL, putData);
            console.log(response);
            toast.success("Perfil actualizado con exito");
            // setSession({
            //     ...sessionData,
            //     nombres: name,
            //     apellidos: lastName,
            //     correoElectronico: mail,
            //     fechaNacimiento: birthdate,
            //     telefono: phoneNumber,
            // });
            setIsLoading(false);
            window.location.reload();
        } catch (e) {
            console.log(e);
            toast.error("Error al actualizar el perfil");
            setIsLoading(false);
        }
    }
}
export default ProfilePage;
