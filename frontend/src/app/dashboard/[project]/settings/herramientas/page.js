"use client"
import { SessionContext } from "@/app/dashboard/layout";
import { useContext, useEffect } from "react";
import { SmallLoadingScreen } from "../../layout";
import { Chip, Divider } from "@nextui-org/react";
import ListToolsInProject from "@/components/dashboardComps/projectComps/settingsComps/ListToolsInProject";

function CheckIcon() {
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
}

export default function ToolsScreen(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const { sessionData } = useContext(SessionContext);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    useEffect(()=>{
        setIsLoadingSmall(false);
    },[]);

    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-2">
            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium text-mainHeaders">
                    Herramientas
                </p>
                <div className="text-slate-400 ">
                    Personaliza tus herramientas. Recuerda que las marcadas
                    como&nbsp;
                    <Chip
                        variant="flat"
                        color="primary"
                        endContent={<CheckIcon />}
                    >
                        Presente
                    </Chip>
                    &nbsp;son necesarias para el desarrollo del proyecto
                </div>
            </div>

            <Divider></Divider>

            <ListToolsInProject
                projectId={projectId}
                refreshPage={()=>{window.location.reload()}}
            />
        </div>
    );
}
