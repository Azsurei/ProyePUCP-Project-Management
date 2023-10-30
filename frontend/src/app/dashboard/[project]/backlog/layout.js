"use client";

import NavigationTab from "@/components/NavigationTab";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";



export default function RootLayout({ children, params }) {
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    return (
        <div className="p-[2.5rem] flex flex-col space-y-2 min-w-[100%] min-h-[100%] h-full">
            <HeaderWithButtonsSamePage
                haveReturn={false}
                haveAddNew={false}
                //handlerAddNew={handlerGoToNew}
                //newPrimarySon={ListComps.length + 1}
                breadcrump={
                    "Inicio / Proyectos / " + projectName + " / Backlog"
                }
                //btnText={"Nueva tarea"}
            >
                Backlog
            </HeaderWithButtonsSamePage>

            <NavigationTab
                listNames={["Kanban", "Sprint Backlog", "Product Backlog"]}
                listGoTo={[
                    `/dashboard/${projectName}=${projectId}/backlog/kanban`,
                    `/dashboard/${projectName}=${projectId}/backlog/sprintBacklog`,
                    `/dashboard/${projectName}=${projectId}/backlog/productBacklog`,
                ]}
            ></NavigationTab>
            {children}
        </div>
    );
}
