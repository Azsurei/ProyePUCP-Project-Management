"use client";
import { useContext, useEffect } from "react";
import { SmallLoadingScreen } from "../../layout";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import { useRouter } from "next/navigation";
import NavigationTab from "@/components/NavigationTab";
import KanbanBoard from "@/components/dashboardComps/projectComps/kanbanComps/KanbanBoard";

export default function Kanban(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const router = useRouter();


    return (
        <KanbanBoard
            projectName={projectName}
            projectId={projectId}
        ></KanbanBoard>
    );
}
