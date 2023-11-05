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
const columns = [
    { name: "Entregables", uid: "entregable" },
    { name: "Rol 1", uid: "rol1" },
    { name: "Rol 2", uid: "rol2" },
    { name: "Rol 3", uid: "rol3" },
    { name: "Rol 4", uid: "rol4" },
];

const rows = [
    {
        id: 1,
        entregable: "Entregable 1",
        roles: [
            { rol1: "Rol 1" },
            { rol2: "Rol 2" },
            { rol3: "Rol 3" },
            { rol4: "Rol 4" },
        ],
    },
    {
        id: 2,
        entregable: "Entregable 2",
        roles: [
            { rol1: "Rol 5" },
            { rol2: "Rol 6" },
            { rol3: "Rol 7" },
            { rol4: "Rol 8" },
        ],
    },
    {
        id: 3,
        entregable: "Entregable 3",
        roles: [
            { rol1: "Rol 9" },
            { rol2: "Rol 10" },
            { rol3: "Rol 11" },
            { rol4: "Rol 12" },
        ],
    },
    {
        id: 4,
        entregable: "Entregable 4",
        roles: [
            { rol1: "Rol 13" },
            { rol2: "Rol 14" },
            { rol3: "Rol 15" },
            { rol4: "Rol 16" },
        ],
    },
    {
        id: 5,
        entregable: "Entregable 5",
        roles: [
            { rol1: "Rol 17" },
            { rol2: "Rol 18" },
            { rol3: "Rol 19" },
            { rol4: "Rol 20" },
        ],
    },
];

export default function MatrizDeResponsabilidades(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const renderCell = React.useCallback((user, columnKey) => {
        console.log("EEE",columnKey);
        switch (columnKey) {
            case "entregable":
                return user[columnKey];
            default:
                const cellValue = user.roles;
                const object = cellValue.find(
                    (obj) => obj[columnKey] !== undefined
                );
                return object[columnKey];
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
