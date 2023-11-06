"use client";
import React from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { SmallLoadingScreen } from "../layout";
import { useState, useEffect, useContext } from "react";
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
    const [dataFromApi, setDataFromApi] = useState([
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
            idResponsabilidad: 1,
            nombreResponsabilidad: "Aprueba",
            letraResponsabilidad: "A",
            colorResponsabilidad: "bg-blue-600",
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
    ]);

    const roles = Array.from(
        new Set(dataFromApi.map((item) => item.nombreRol))
    );
    const entregables = Array.from(
        new Set(dataFromApi.map((item) => item.nombreEntregable))
    );
    const responsabilidadesMap = new Map();
    dataFromApi.forEach((item) => {
        responsabilidadesMap.set(item.idResponsabilidad, {
            id: item.idResponsabilidad,
            nombre: item.nombreResponsabilidad,
            letra: item.letraResponsabilidad,
            color: item.colorResponsabilidad,
        });
    });

    const responsabilidades = Array.from(responsabilidadesMap.values());

    console.log("Roles", roles);
    console.log("Entregables", entregables);
    console.log("Responsabilidades", responsabilidades);

    const columns = [
        { name: "Entregables", uid: "entregable" },
        ...roles.map((role) => ({ name: role, uid: role.toLowerCase() })),
    ];

    const rows = entregables.map((entregable, index) => {
        const row = {
            id: index,
            entregable,
        };
        roles.forEach((role) => {
            const dataForRoleAndEntregable = dataFromApi.find(
                (item) =>
                    item.nombreRol === role &&
                    item.nombreEntregable === entregable
            );
            row[role.toLowerCase()] = dataForRoleAndEntregable
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
    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];
        const color = getColorForResponsabilidad(cellValue);
        switch (columnKey) {
            case "entregable":
                return cellValue;
            default:
                return (
                    <>
                        {/*                         <div className={`${color} cursor-pointer`}>
                            {cellValue}
                        </div> */}
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    variant="bordered"
                                    className={`${color}`}
                                >
                                    {cellValue}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Dynamic Actions"
                                items={responsabilidades}
                                variant="flat"
                            >
                                {(item) => (
                                    <DropdownItem key={item.id}>
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
    }, []);

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    return (
        <>
            <div>Inicio/Proyectos/Proyecto/Matriz de responsabilidades</div>
            <div className="text-[#172B4D] font-semibold text-[2rem] my-[0.5rem]">
                Matriz de responsabilidades
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
