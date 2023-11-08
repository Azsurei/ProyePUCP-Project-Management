"use client";
import React from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { SmallLoadingScreen } from "../layout";
import { useState, useEffect, useContext } from "react";
import { SaveIcon } from "@/components/equipoComps/SaveIcon";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
    getKeyValue,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react";

export default function MatrizDeResponsabilidades(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const [dataFromApi, setDataFromApi] = useState([]);
    const [roles, setRoles] = useState([]);
    const [entregables, setEntregables] = useState([]);
    const [responsabilidades, setResponsabilidades] = useState([]);
    const [modifiedCells, setModifiedCells] = useState([]);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectIdString = decodedUrl.substring(
        decodedUrl.lastIndexOf("=") + 1
    );
    const projectId = parseInt(projectIdString);

    useEffect(() => {
        // Datos iniciales
        console.log("El id del proyecto es", projectId);
        console.log("El tipo de dato de projectID es", typeof projectId);
        const initialDataFromApi = [];
        const stringURLRoles =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/matrizResponsabilidad/listarRol/" +
            projectId;
        const stringURLEntregables =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/matrizResponsabilidad/listarEntregables/" +
            projectId;
        const stringURLResponsabilidades =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/matrizResponsabilidad/listarResponsabilidad/" +
            projectId;

        axios
            .get(stringURLRoles)
            .then(function (response) {
                const initialRoles = response.data.roles;
                axios
                    .get(stringURLResponsabilidades)
                    .then(function (response) {
                        const initialResponsabilidades =
                            response.data.responsabilidadRol;
                        axios
                            .get(stringURLEntregables)
                            .then(function (response) {
                                const initialEntregables =
                                    response.data.entregables;
                                const completedData = [];

                                // Recorre todos los roles y entregables
                                initialRoles.forEach((rol) => {
                                    initialEntregables.forEach((entregable) => {
                                        // Verifica si la combinación de idRol e idEntregable ya existe en dataFromApi
                                        const existingData =
                                            initialDataFromApi.find(
                                                (item) =>
                                                    item.idRol === rol.id &&
                                                    item.idEntregable ===
                                                        entregable.id
                                            );

                                        if (existingData) {
                                            // Si existe, simplemente agrega los datos existentes
                                            completedData.push(existingData);
                                        } else {
                                            // Si no existe, crea una celda vacía o con valores predeterminados
                                            completedData.push({
                                                idRol: rol.id,
                                                nombreRol: rol.nombre,
                                                idEntregable: entregable.id,
                                                nombreEntregable:
                                                    entregable.nombre,
                                                // Puedes definir valores predeterminados para otras propiedades
                                                idResponsabilidad: 0,
                                                nombreResponsabilidad: "",
                                                letraResponsabilidad: "",
                                                colorResponsabilidad: "",
                                                isNew: true, // Marcar como nueva celda
                                            });
                                        }
                                    });
                                });
                                console.log(
                                    "Data from API",
                                    initialDataFromApi
                                );
                                console.log("Roles", initialRoles);
                                console.log("Entregables", initialEntregables);
                                console.log(
                                    "Responsabilidades",
                                    initialResponsabilidades
                                );
                                // Establecer los datos iniciales en los hooks
                                setDataFromApi(completedData);
                                setRoles(initialRoles);
                                setEntregables(initialEntregables);
                                setResponsabilidades(initialResponsabilidades);
                                setIsLoadingSmall(false);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const columns = [
        { name: "Entregables", uid: "entregable" },
        ...roles.map((role) => ({ name: role.nombre, uid: role.nombre })),
    ];

    const rows = entregables.map((entregable, index) => {
        const row = {
            id: index,
            entregable: entregable.nombre,
        };
        roles.forEach((role) => {
            const dataForRoleAndEntregable = dataFromApi.find(
                (item) =>
                    item.nombreRol === role.nombre &&
                    item.nombreEntregable === entregable.nombre
            );
            row[role.nombre] = dataForRoleAndEntregable
                ? dataForRoleAndEntregable.letraResponsabilidad
                : ""; // Asegúrate de ajustar esto según la propiedad correcta en tus datos
        });
        return row;
    });

    const getColorForResponsabilidad = (letraResponsabilidad) => {
        const responsabilidad = responsabilidades.find(
            (item) => item.letra === letraResponsabilidad
        );
        return responsabilidad ? responsabilidad.color : "";
    };

    const changeCell = (idRol, idEntregable, item) => {
        // Crea una copia del arreglo dataFromApi
        const updatedData = [...dataFromApi];

        // Encuentra el índice del objeto que deseas actualizar
        const rowIndex = updatedData.findIndex(
            (data) => data.idRol === idRol && data.idEntregable === idEntregable
        );

        // Si se encontró el índice, actualiza la propiedad letraResponsabilidad
        if (rowIndex !== -1) {
            updatedData[rowIndex].letraResponsabilidad = item.letra;
            updatedData[rowIndex].colorResponsabilidad = item.color;
            updatedData[rowIndex].nombreResponsabilidad = item.nombre;
            updatedData[rowIndex].idResponsabilidad = item.id;
            // Agrega la celda modificada a modifiedCells
            setModifiedCells([...modifiedCells, updatedData[rowIndex]]);
        }

        // Actualiza el estado con el nuevo arreglo
        setDataFromApi(updatedData);
    };

    const renderCell = React.useCallback(
        (user, columnKey) => {
            console.log("El key de la columna es:", columnKey);
            const cellValue = user[columnKey];
            const color = getColorForResponsabilidad(cellValue);
            const entregableMatch = entregables.find(
                (item) => item.nombre === user.entregable
            );

            const idEntregable = entregableMatch ? entregableMatch.id : null;
            console.log("El id del entregable es:", idEntregable);
            let idRol;
            if (columnKey !== "entregable") {
                const roleMatch = roles.find(
                    (item) => item.nombre === columnKey
                );
                idRol = roleMatch ? roleMatch.id : null;
            } else {
                idRol = -1;
            }

            switch (columnKey) {
                case "entregable":
                    return cellValue;
                default:
                    return (
                        <>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        variant="bordered"
                                        className={`transition-transform ${color} hover:shadow-md hover:scale-105`}
                                    >
                                        {cellValue}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Dynamic Actions"
                                    items={responsabilidades}
                                    variant="flat"
                                    disabledKeys={cellValue}
                                >
                                    {(item) => (
                                        <DropdownItem
                                            key={item.letra}
                                            textValue={item.nombre}
                                            onPress={() =>
                                                changeCell(
                                                    idRol,
                                                    idEntregable,
                                                    item
                                                )
                                            }
                                        >
                                            <div className="flex">
                                                <div className="inline w-1/4">
                                                    {item.letra}
                                                </div>
                                                <div className="inline w-3/4">
                                                    {item.nombre}
                                                </div>
                                            </div>
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </>
                    );
            }
        },
        [dataFromApi, roles, entregables, responsabilidades]
    );

    const saveFunction = () => {
        const newCells = modifiedCells.filter((cell) => cell.isNew);
        const modifiedExistingCells = modifiedCells.filter(
            (cell) => !cell.isNew
        );

        console.log("Celdas a insertar:", newCells);
        console.log("Celdas a modificar:", modifiedExistingCells);

        // Ahora puedes realizar las peticiones POST y PUT según corresponda
    };

    return (
        <>
            <div className="px-[1rem]">
                Inicio/Proyectos/Proyecto/Matriz de responsabilidades
            </div>
            <div className="flex items-center justify-between my-[0.5rem] px-[1rem]">
                <div className="text-[#172B4D] font-semibold text-[2rem] ">
                    Matriz de responsabilidades
                </div>
                <Button
                    color="primary"
                    startContent={<SaveIcon />}
                    onPress={saveFunction}
                >
                    Guardar
                </Button>
            </div>
            <Table
                aria-label="Example table with custom cells"
                className="px-[1rem]"
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            className="bg-blue-600 text-white text-center"
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={rows}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell className="text-center">
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
