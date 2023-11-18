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
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    const [standars, setStandars] = useState([]);
    const [quantity1, setQuantity1] = useState(0);

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    function addContainer1() {
        setStandars([
            ...standars,
            {
                idStandars: `a${quantity1}`,
                standars: "",
            },
        ]);
        setQuantity1(quantity1 + 1);
    }

    const updateStandarsField = (index, value) => {
        setStandars((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index - 1].standars = value;
            return updatedFields;
        });
    };

    function removeContainer1(indice) {
        setQuantity1(quantity1 - 1);
        setStandars((prevFields) => {
            const updatedFields = [...prevFields];
            // Elimina el elemento con el índice proporcionado
            updatedFields.splice(indice, 1);
            return updatedFields;
        });
    }

    const findModifiedDeletedAdded = (
        originalArray,
        newArray,
        comparisonField
    ) => {
        const modifiedArray = [];
        const deletedArray = [];
        const addedArray = [];

        // Encuentra elementos modificados y eliminados
        originalArray.forEach((originalItem) => {
            const newItem = newArray.find(
                (newItem) =>
                    newItem[comparisonField] === originalItem[comparisonField]
            );

            if (newItem) {
                modifiedArray.push(newItem);
                /*                 if (JSON.stringify(originalItem) !== JSON.stringify(newItem)) {
                    modifiedArray.push(newItem);
                } */
            } else {
                deletedArray.push(originalItem);
            }
        });

        // Encuentra elementos añadidos
        newArray.forEach((newItem) => {
            if (
                !originalArray.some(
                    (originalItem) =>
                        originalItem[comparisonField] ===
                        newItem[comparisonField]
                )
            ) {
                addedArray.push(newItem);
            }
        });

        return { modifiedArray, deletedArray, addedArray };
    };

    return (
        <div class="flex-1 font-[Montserrat] flex flex-col w-full h-auto pl-8 pr-8 gap-4">
            <div class="flex items-center w-full pt-4">
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
            <div className="flex justify-between items-center">
                <div className="flex items-center text-[32px] font-semibold">
                    Plan de calidad
                </div>
                <div>
                    {!editMode && (
                        <Button
                            color="primary"
                            onPress={() => {
                                setEditMode(true);
                            }}
                        >
                            Editar
                        </Button>
                    )}

                    {editMode && (
                        <Button
                            color="primary"
                            onPress={() => {
                                setEditMode(false);
                            }}
                        >
                            Cancelar
                        </Button>
                    )}
                </div>
            </div>
            <div>
                <div class="flex gap-3">
                    <h4 class="font-semibold">
                        Estándares y normas de calidad
                    </h4>
                </div>
                {quantity1 === 0 ? (
                    <div className="flex justify-center items-center">
                        <div>
                            ¡Puede agregar algunos estándares y normas de
                            calidad!
                        </div>
                    </div>
                ) : (
                    standars.map((standars, index) => (
                        <ContainerRequirementsCI
                            key={index}
                            indice={index + 1}
                            updateRequirementsField={updateStandarsField}
                            requirements={standars}
                            functionRemove={removeContainer1}
                            isDisabled={!editMode}
                        />
                    ))
                )}
                {editMode === true && (
                    <div className="flex justify-end">
                        <div className="flex gap-10 p-4">
                            <Button
                                onClick={addContainer1}
                                className="rounded-full bg-yellow-500 border-2 border-yellow-500 h-10 text-white text-sm font-semibold w-28 cursor-pointer outline-none"
                                type="button"
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
