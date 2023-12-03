"use client";
import { SessionContext } from "@/app/dashboard/layout";
import ListUsersInProject from "@/components/dashboardComps/projectComps/settingsComps/ListUsersInProject";
import { Divider } from "@nextui-org/react";
import { useContext, useEffect } from "react";
import { SmallLoadingScreen } from "../../layout";

export default function UsersScreen(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const { sessionData } = useContext(SessionContext);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const loadDelete = sessionData.rolNameInProject !== "Supervisor";



    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-2">
            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium text-mainHeaders">
                    Usuarios
                </p>
                <p className="text-slate-400">
                    Añade usuarios o elimina algunos de tu proyecto
                </p>
            </div>

            <Divider></Divider>

            <ListUsersInProject
                projectId={projectId}
                refreshPage={() => {
                    window.location.reload();
                }}
                loadDelete={loadDelete}
            />
        </div>
    );
}
