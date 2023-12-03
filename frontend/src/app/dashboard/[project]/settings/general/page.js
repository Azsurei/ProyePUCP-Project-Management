"use client";
import DateInput from "@/components/DateInput";
import { Divider, Textarea } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { ProjectInfo, SmallLoadingScreen } from "../../layout";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import { dbDateToDisplayDate, dbDateToInputDate } from "@/common/dateFunctions";
import { toast } from "sonner";
import axios from "axios";
axios.defaults.withCredentials = true;

export default function GeneralScreen() {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { projectInfo } = useContext(ProjectInfo);
    const twStyle1 = "text-lg font-medium";
    const [projectName, setProjectName] = useState("");
    const [validName, setValidName] = useState(true);
    const [msgEmptyField, setMsgEmptyField] = useState("Error");

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [validFechas, setValidFechas] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const [canSave, setCanSave] = useState(false);

    useEffect(() => {
        setIsLoadingSmall(false);
        console.log(projectInfo);
        setProjectName(projectInfo.nombre);
        setFechaInicio(dbDateToInputDate(projectInfo.fechaInicio));
        setFechaFin(dbDateToInputDate(projectInfo.fechaFin));
    }, []);

    useEffect(() => {
        console.log("Te");
        if (
            projectName !== projectInfo.nombre ||
            fechaInicio !== dbDateToInputDate(projectInfo.fechaInicio) ||
            fechaFin !== dbDateToInputDate(projectInfo.fechaFin)
        ) {
            setCanSave(true);
        } else {
            setCanSave(false);
        }
    }, [projectName, fechaInicio, fechaFin]);

    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-5">
            <div className="flex flex-col space-y-2">
                <div className="flex flex-col mb-3">
                    <p className="text-2xl font-medium text-mainHeaders">
                        Configuración general
                    </p>
                    <p className="text-slate-400">
                        Modifica información de tu proyecto
                    </p>
                </div>

                <Divider></Divider>

                <p className={twStyle1}>Nombre de proyecto</p>
                <Textarea
                    variant={"bordered"}
                    aria-label="name-lbl"
                    isInvalid={!validName}
                    errorMessage={!validName ? msgEmptyField : ""}
                    labelPlacement="outside"
                    label=""
                    placeholder="Escriba aquí"
                    classNames={{ label: "pb-0" }}
                    value={projectName}
                    onValueChange={setProjectName}
                    minRows={1}
                    size="md"
                    onChange={() => {
                        setValidName(true);
                    }}
                />

                <div className="flex flex-row justify-between gap-5">
                    <div className="flex flex-col flex-1">
                        <p className={twStyle1}>Fechas inicio:</p>
                        <DateInput
                            isEditable={true}
                            className={""}
                            isInvalid={!validFechas}
                            onChangeHandler={(e) => {
                                setFechaInicio(e.target.value);
                                setValidFechas(true);
                            }}
                            value={fechaInicio}
                        ></DateInput>
                    </div>
                    <div className="flex flex-col flex-1">
                        <p className={twStyle1}>Fecha fin</p>
                        <DateInput
                            isEditable={true}
                            className={""}
                            isInvalid={!validFechas}
                            onChangeHandler={(e) => {
                                setFechaFin(e.target.value);
                                setValidFechas(true);
                            }}
                            value={fechaFin}
                        ></DateInput>
                    </div>
                </div>
            </div>

            <div className="flex flex-row justify-end mt-8">
                {canSave ? (
                    <Modal
                        nameButton="Guardar"
                        textHeader="Actualizar datos de proyecto"
                        textBody="¿Seguro que quiere actualizar estos datos del proyecto?"
                        colorButton="w-36 bg-blue-950 text-white"
                        oneButton={false}
                        isLoading={isLoading}
                        secondAction={async () => {
                            setIsLoading(true);
                            await updateProjectInfo();
                        }}
                        closeSecondActionState={true}
                        textColor="blue"
                        verifyFunction={() => {
                            return true;
                        }}
                    />
                ) : null}
            </div>
        </div>
    );

    async function updateProjectInfo() {
        const url =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/actualizarDatos";
        try {
            const response = await axios.put(url, {
                idProyecto: projectInfo.idProyecto,
                nombre: projectName,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
            });

            console.log(response);

            if(response.status === 209){
                toast.warning("Las fechas introducidas no cubren el rango de fechas de las herramientas del proyecto");
                setIsLoading(false);
            }
            else{
                toast.success("Informacion de proyecto actualizada con exito");
                setIsLoading(false);
                //window.location.reload();
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            toast.error("Error al actualizar informacion de proyecto");
        }
    }
}
