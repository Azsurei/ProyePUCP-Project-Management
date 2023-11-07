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

    useEffect(() => {
        // Datos iniciales
        const initialDataFromApi = [
            {
                idRol: 1,
                nombreRol: "ROL1",
                idEntregable: 1,
                nombreEntregable: "Entregable 1",
                idResponsabilidad: 1,
                nombreResponsabilidad: "Aprueba",
                letraResponsabilidad: "A",
                colorResponsabilidad: "bg-blue-600",
            },
            {
                idRol: 2,
                nombreRol: "ROL2",
                idEntregable: 1,
                nombreEntregable: "Entregable 1",
                idResponsabilidad: 3,
                nombreResponsabilidad: "Participa",
                letraResponsabilidad: "P",
                colorResponsabilidad: "bg-purple-600",
            },
            {
                idRol: 3,
                nombreRol: "ROL3",
                idEntregable: 1,
                nombreEntregable: "Entregable 1",
                idResponsabilidad: 1,
                nombreResponsabilidad: "Aprueba",
                letraResponsabilidad: "A",
                colorResponsabilidad: "bg-blue-600",
            },
            {
                idRol: 4,
                nombreRol: "ROL4",
                idEntregable: 1,
                nombreEntregable: "Entregable 1",
                idResponsabilidad: 2,
                nombreResponsabilidad: "Se le informa",
                letraResponsabilidad: "I",
                colorResponsabilidad: "bg-red-600",
            },
            {
                idRol: 1,
                nombreRol: "ROL1",
                idEntregable: 2,
                nombreEntregable: "Entregable 2",
                idResponsabilidad: 2,
                nombreResponsabilidad: "Se le informa",
                letraResponsabilidad: "I",
                colorResponsabilidad: "bg-red-600",
            },
            {
                idRol: 2,
                nombreRol: "ROL2",
                idEntregable: 2,
                nombreEntregable: "Entregable 2",
                idResponsabilidad: 1,
                nombreResponsabilidad: "Aprueba",
                letraResponsabilidad: "A",
                colorResponsabilidad: "bg-blue-600",
            },
            {
                idRol: 3,
                nombreRol: "ROL3",
                idEntregable: 2,
                nombreEntregable: "Entregable 2",
                idResponsabilidad: 1,
                nombreResponsabilidad: "Aprueba",
                letraResponsabilidad: "A",
                colorResponsabilidad: "bg-blue-600",
            },
            {
                idRol: 4,
                nombreRol: "ROL4",
                idEntregable: 2,
                nombreEntregable: "Entregable 2",
                idResponsabilidad: 1,
                nombreResponsabilidad: "Aprueba",
                letraResponsabilidad: "A",
                colorResponsabilidad: "bg-blue-600",
            },
        ];
        const initialRoles = [
            { id: 1, nombre: "ROL1" },
            { id: 2, nombre: "ROL2" },
            { id: 3, nombre: "ROL3" },
            { id: 4, nombre: "ROL4" },
        ];

        const initialEntregables = [
            { id: 1, nombre: "Entregable 1" },
            { id: 2, nombre: "Entregable 2" },
            { id: 3, nombre: "Entregable 3" },
        ];

        const initialResponsabilidades = [
            { id: 1, nombre: "Aprueba", letra: "A", color: "bg-blue-600" },
            { id: 2, nombre: "Se le informa", letra: "I", color: "bg-red-600" },
            { id: 3, nombre: "Participa", letra: "P", color: "bg-purple-600" },
            // Agrega más responsabilidades según tus necesidades
        ];

        const completedData = [];

        // Recorre todos los roles y entregables
        initialRoles.forEach((rol) => {
            initialEntregables.forEach((entregable) => {
                // Verifica si la combinación de idRol e idEntregable ya existe en dataFromApi
                const existingData = initialDataFromApi.find(
                    (item) =>
                        item.idRol === rol.id &&
                        item.idEntregable === entregable.id
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
                        nombreEntregable: entregable.nombre,
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

        console.log("Data from API", initialDataFromApi);
        console.log("Roles", initialRoles);
        console.log("Entregables", initialEntregables);
        console.log("Responsabilidades", initialResponsabilidades);
        // Establecer los datos iniciales en los hooks
        setDataFromApi(completedData);
        setRoles(initialRoles);
        setEntregables(initialEntregables);
        setResponsabilidades(initialResponsabilidades);
        setIsLoadingSmall(false);
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
        console.log("Celdas modificadas:", modifiedCells);
        // Aquí puedes hacer la petición POST al backend para guardar los datos
    }

    return (
        <>
            <div className="px-[1rem]">
                Inicio/Proyectos/Proyecto/Matriz de responsabilidades
            </div>
            <div className="flex items-center justify-between my-[0.5rem] px-[1rem]">
                <div className="text-[#172B4D] font-semibold text-[2rem] ">
                    Matriz de responsabilidades
                </div>
                <Button color="primary" startContent={<SaveIcon />} onPress={saveFunction}>
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
