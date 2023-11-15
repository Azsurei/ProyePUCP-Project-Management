"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SmallLoadingScreen } from "../../layout";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import ColumnRetro from "@/components/dashboardComps/projectComps/retrospectivasComps/ColumnRetro";
import axios from "axios";
import { Toaster, toast } from "sonner";
axios.defaults.withCredentials = true;

function RetrospectivaView(props) {
    const router = useRouter();
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const keyParamURL = decodeURIComponent(props.params.retrospectivaId);

    const [editMode, setEditMode] = useState(false);
    const [idLineaRetrospectiva, setIdLineaRetrospectiva] = useState(null);
    const [mainItemsList, setMainItemsList] = useState([]);

    //puede ser id
    //puede ser id=edit
    //else pagina no existe

    useEffect(() => {
        setIsLoadingSmall(true);

        const numberPattern = /^\d+$/;
        const editPattern = /^\d+=edit$/;

        if (numberPattern.test(keyParamURL)) {
            console.log("It's a number:", keyParamURL);
            //habria que verificar si linea retro pertenece a este proyecto

            const retroLineId = parseInt(keyParamURL);
            setIdLineaRetrospectiva(retroLineId);
            setEditMode(false);

            const viewItemsURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/retrospectiva/listarItemLineasRetrospectivaXIdLineaRetrospectiva/" +
                retroLineId;

            axios
                .get(viewItemsURL)
                .then(function (response) {
                    console.log(response);
                    setMainItemsList(response.data.LineaRetrospectiva);
                    setIsLoadingSmall(false);
                })
                .catch(function (error) {
                    console.log(error);
                    toast.error("Error al cargar lista de items");
                });
        } else if (editPattern.test(keyParamURL)) {
            console.log("It's a number followed by '=edit':", keyParamURL);
            //habria que verificar si linea retro pertenece a este proyecto

            const retroLineId = parseInt(
                keyParamURL.substring(0, keyParamURL.lastIndexOf("="))
            );
            setIdLineaRetrospectiva(retroLineId);
            setEditMode(true);

            const viewItemsURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/retrospectiva/listarItemLineasRetrospectivaXIdLineaRetrospectiva/" +
                retroLineId;

            axios
                .get(viewItemsURL)
                .then(function (response) {
                    console.log(response);
                    setMainItemsList(response.data.LineaRetrospectiva);
                    setIsLoadingSmall(false);
                })
                .catch(function (error) {
                    console.log(error);
                    toast.error("Error al cargar lista de items");
                });
        } else {
            router.push("/404");
        }
    }, []);

    return (
        <>
            <div className="flex-1 min-h-full p-[2.5rem] flex flex-col gap-4 border border-red-500">
                <div className="flex flex-col">
                    <div className="flex flex-row items-end">
                        <HeaderWithButtonsSamePage
                            haveReturn={true}
                            haveAddNew={false}
                            handlerReturn={() => {
                                setIsLoadingSmall(true);
                                handleBackToMain();
                            }}
                            breadcrump={
                                "Inicio / Proyectos / " +
                                projectName +
                                " / Retrospectivas"
                            }
                            btnText={""}
                        >
                            {"Retrospectiva " + "hola"}
                        </HeaderWithButtonsSamePage>

                        {editMode === false && (
                            <Button
                                onPress={handleEdit}
                                color="primary"
                                className="font-[Montserrat] w-[100px]"
                            >
                                Editar
                            </Button>
                        )}
                        {editMode === true && (
                            <Button
                                onPress={handleSave}
                                color="primary"
                                className="font-[Montserrat] w-[190px]"
                            >
                                Guardar
                            </Button>
                        )}
                    </div>
                    <p className="font-[Montserrat] text-slate-500">
                        Analicen cómo trabajaron en equipo y definir qué pueden
                        mejorar para las próximas iteraciones.
                    </p>
                </div>

                <div className="flex-1 flex flex-row gap-5">
                    {mainItemsList.length !== 0 && (
                        <>
                            <ColumnRetro
                                columnState={1}
                                state={editMode}
                                idLineaRetrospectiva={idLineaRetrospectiva}
                                baseItemsList={mainItemsList[0].items}
                            />
                            <ColumnRetro
                                columnState={2}
                                state={editMode}
                                idLineaRetrospectiva={idLineaRetrospectiva}
                                baseItemsList={mainItemsList[1].items}
                            />
                            <ColumnRetro
                                columnState={3}
                                state={editMode}
                                idLineaRetrospectiva={idLineaRetrospectiva}
                                baseItemsList={mainItemsList[2].items}
                            />
                        </>
                    )}
                </div>
            </div>
            <Toaster richColors position="top-center"></Toaster>
        </>
    );

    function handleBackToMain() {
        router.push(
            "/dashboard/" + projectName + "=" + projectId + "/retrospectivas"
        );
    }

    function handleEdit() {
        router.push(
            "/dashboard/" +
                projectName +
                "=" +
                projectId +
                "/retrospectivas/" +
                idLineaRetrospectiva +
                "=edit"
        );
    }

    function handleSave() {
        // Calculate the counts based on the number of items in each list
        const cantBien = mainItemsList[0]?.items?.length || 0;
        const cantMal = mainItemsList[1]?.items?.length || 0;
        const cantQueHacer = mainItemsList[2]?.items?.length || 0;

        const saveData = {
            idLineaRetrospectiva: idLineaRetrospectiva,
            cantBien: cantBien,
            cantMal: cantMal,
            cantQueHacer: cantQueHacer
        };

        const saveURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/proyecto/retrospectiva/modificarLineaRetrospectiva";

        axios.put(saveURL, saveData)
            .then(response => {
                console.log('Save successful:', response);
                toast.success('Retrospectiva actualizada con éxito');

                // Redirect after saving
                router.push("/dashboard/" + projectName + "=" + projectId + "/retrospectivas/" + idLineaRetrospectiva);
            })
            .catch(error => {
                console.error('Error saving:', error);
                toast.error('Error al actualizar la retrospectiva');
            });
    }
}
export default RetrospectivaView;
