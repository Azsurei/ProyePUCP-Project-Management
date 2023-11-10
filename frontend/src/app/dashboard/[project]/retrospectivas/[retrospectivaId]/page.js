"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SmallLoadingScreen } from "../../layout";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import ColumnRetro from "@/components/dashboardComps/projectComps/retrospectivasComps/ColumnRetro";

function RetrospectivaView(props) {
    const router = useRouter();
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const keyParamURL = decodeURIComponent(props.params.retrospectivaId);

    const [editMode, setEditMode] = useState(false);
    const [idLineaRetrospectiva, setIdLineaRetrospectiva] = useState(null);

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

            setIsLoadingSmall(false);
        } else if (editPattern.test(keyParamURL)) {
            console.log("It's a number followed by '=edit':", keyParamURL);
            //habria que verificar si linea retro pertenece a este proyecto

            const retroLineId = decodedUrl.substring(
                0,
                decodedUrl.lastIndexOf("=")
            );
            setIdLineaRetrospectiva(retroLineId);
            setEditMode(true);

            setIsLoadingSmall(false);
        } else {
            router.push("/404");
        }
    }, []);

    return (
        <div className="flex-1 min-h-full p-[2.5rem] flex flex-col gap-4">
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
                            className="font-[Montserrat] w-[100px]"
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
                <ColumnRetro columnState={1} state={editMode}/>
                <ColumnRetro columnState={2} state={editMode}/>
                <ColumnRetro columnState={3} state={editMode}/>
            </div>
        </div>
    );

    function handleBackToMain(){
        router.push(
            "/dashboard/" +
                projectName +
                "=" +
                projectId +
                "/retrospectivas"
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
        router.back();
    }
}
export default RetrospectivaView;
