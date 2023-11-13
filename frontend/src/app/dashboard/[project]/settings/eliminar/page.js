"use client"
import ModalDeleteConfirmation from "@/components/dashboardComps/projectComps/settingsComps/ModalDeleteConfirmation";
import { Button, Divider, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { SmallLoadingScreen } from "../../layout";

export default function DeleteScreen(props) {
    const router = useRouter();
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const {
        isOpen: isModalDeleteOpen,
        onOpen: onModalDeleteOpen,
        onOpenChange: onModalDeleteChange,
    } = useDisclosure();

    useEffect(()=>{
        setIsLoadingSmall(false);
    },[]);

    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-2">
            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium text-mainHeaders">
                    Eliminar Proyecto
                </p>
                <p className="text-slate-400">
                    Elimina tu proyecto, tus herramientas y todos los datos
                    asociados a él. ¡Ten cuidado!
                </p>
            </div>

            <Divider></Divider>

            <Button
                color="danger"
                className="max-w-xs w-60"
                onPress={onModalDeleteOpen}
            >
                Eliminar Proyecto
            </Button>

            <ModalDeleteConfirmation
                isOpen={isModalDeleteOpen}
                onOpenChange={onModalDeleteChange}
                idProyecto={projectId}
                handlePushToDashboard={() => {
                    router.push("/dashboard");
                }}
            />
        </div>
    );
}
