"use client";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { SmallLoadingScreen } from "../layout";
import { Textarea, Input, Button } from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
axios.defaults.withCredentials = true;

export default function PlanDeCalidad(props) {
    const keyParamURL = decodeURIComponent(props.params.updateCI);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    return (
        <div class="flex-1 font-[Montserrat] flex flex-col w-full h-auto pl-8 pr-8">
            <div class="flex items-center w-full pt-4 pb-3">
                <Breadcrumbs>
                    <BreadcrumbsItem
                        href="/dashboard"
                        text={"Inicio"}
                    ></BreadcrumbsItem>
                    <BreadcrumbsItem
                        href="/dashboard"
                        text={"Proyectos"}
                    ></BreadcrumbsItem>
                    <BreadcrumbsItem
                        href={"/dashboard/" + projectName + "=" + projectId}
                        text={projectName}
                    ></BreadcrumbsItem>
                    <BreadcrumbsItem
                        href={
                            "/dashboard/" +
                            projectName +
                            "=" +
                            projectId +
                            "/matrizDeResponsabilidades"
                        }
                        text={"Plan de calidad"}
                    ></BreadcrumbsItem>
                </Breadcrumbs>
            </div>
            <div className="w-full grid grid-rows-4 gap-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-[32px] font-semibold">
                        Plan de calidad
                    </div>
                    <div>
                        {!editMode && (
                            <Button
                                color="primary"
                                onPress={() => {
                                    setIsLoadingSmall(true);
                                    router.push(
                                        "/dashboard/" +
                                            projectName +
                                            "=" +
                                            projectId +
                                            "/planDeCalidad/" +
                                            "=edit"
                                    );
                                }}
                            >
                                Editar
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
