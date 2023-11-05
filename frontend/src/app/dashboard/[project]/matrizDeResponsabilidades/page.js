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
} from "@nextui-org/react";

const dataFromApi = [
    {
        idRol: 1,
        nombreRol: "ROL1",
        idEntregable: 1,
        nombreEntregable: "Entregable 1",
        idResponsabilidad: 1,
        nombreResponsabilidad: "Aprueba",
    },
    {
        idRol: 2,
        nombreRol: "ROL2",
        idEntregable: 1,
        nombreEntregable: "Entregable 1",
        idResponsabilidad: 1,
        nombreResponsabilidad: "Aprueba",
    },
    {
        idRol: 3,
        nombreRol: "ROL3",
        idEntregable: 1,
        nombreEntregable: "Entregable 1",
        idResponsabilidad: 1,
        nombreResponsabilidad: "Aprueba",
    },
    {
        idRol: 4,
        nombreRol: "ROL4",
        idEntregable: 1,
        nombreEntregable: "Entregable 1",
        idResponsabilidad: 2,
        nombreResponsabilidad: "Se le informa",
    },
    {
        idRol: 1,
        nombreRol: "ROL1",
        idEntregable: 2,
        nombreEntregable: "Entregable 2",
        idResponsabilidad: 2,
        nombreResponsabilidad: "Se le informa",
    },
    {
        idRol: 2,
        nombreRol: "ROL2",
        idEntregable: 2,
        nombreEntregable: "Entregable 2",
        idResponsabilidad: 1,
        nombreResponsabilidad: "Aprueba",
    },
    {
        idRol: 3,
        nombreRol: "ROL3",
        idEntregable: 2,
        nombreEntregable: "Entregable 2",
        idResponsabilidad: 1,
        nombreResponsabilidad: "Aprueba",
    },
    {
        idRol: 4,
        nombreRol: "ROL4",
        idEntregable: 2,
        nombreEntregable: "Entregable 2",
        idResponsabilidad: 1,
        nombreResponsabilidad: "Aprueba",
    },
];

const roles = Array.from(new Set(dataFromApi.map((item) => item.nombreRol)));
const entregables = Array.from(
    new Set(dataFromApi.map((item) => item.nombreEntregable))
);

console.log("Roles", roles);
console.log("Entregables", entregables);

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
                item.nombreRol === role && item.nombreEntregable === entregable
        );
        row[role.toLowerCase()] = dataForRoleAndEntregable
            ? dataForRoleAndEntregable.nombreResponsabilidad
            : ""; // Asegúrate de ajustar esto según la propiedad correcta en tus datos
    });
    return row;
});

export default function MatrizDeResponsabilidades(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const renderCell = React.useCallback((user, columnKey) => {
        switch (columnKey) {
            case "entregable":
                return user[columnKey];
            default:
                return user[columnKey];
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
                removeWrapper
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align="start"
                            className="bg-blue-600 text-white"
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={rows}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>
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
