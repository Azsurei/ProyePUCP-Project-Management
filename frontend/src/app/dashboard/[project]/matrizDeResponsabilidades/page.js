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
    { name: "Entregables", uid: "entregable"},
    { name: "Rol 1", uid: "rol1" },
    { name: "Rol 2", uid: "rol2" },
    { name: "Rol 3", uid: "rol3" },
    { name: "Rol 4", uid: "rol4" },
];

const rows = [
    {
        id: 1,
        rol1: "Tony Reichert",
        rol2: "CEO",
        team: "Management",
        rol3: "active",
        age: "29",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "tony.reichert@example.com",
        entregable: "Entregable 1",
    },
    {
        id: 2,
        rol1: "Zoey Lang",
        rol2: "Technical Lead",
        team: "Development",
        rol3: "paused",
        age: "25",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        email: "zoey.lang@example.com",
        entregable: "Entregable 2",
    },
    {
        id: 3,
        rol1: "Jane Fisher",
        rol2: "Senior Developer",
        team: "Development",
        rol3: "active",
        age: "22",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        email: "jane.fisher@example.com",
        entregable: "Entregable 3",
    },
    {
        id: 4,
        rol1: "William Howard",
        rol2: "Community Manager",
        team: "Marketing",
        rol3: "vacation",
        age: "28",
        avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
        email: "william.howard@example.com",
        entregable: "Entregable 4",
    },
    {
        id: 5,
        rol1: "Kristen Copper",
        rol2: "Sales Manager",
        team: "Sales",
        rol3: "active",
        age: "24",
        avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
        email: "kristen.cooper@example.com",
        entregable: "Entregable 5",
    },
];

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};
export default function MatrizDeResponsabilidades(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "rol1":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                );
            case "rol2":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {cellValue}
                        </p>
                        <p className="text-bold text-sm capitalize text-default-400">
                            {user.team}
                        </p>
                    </div>
                );
            case "rol3":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[user.rol3]}
                        size="sm"
                        variant="flat"
                    >
                        {cellValue}
                    </Chip>
                );
            case "rol4":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                EyenIcon
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit user">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                EditIcon
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                DeleteIcon
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);
    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    return (
        <>
            <div>Inicio/Proyectos/Proyecto/Matriz de responsabilidades</div>
            <div className="text-[#172B4D] font-semibold text-[2rem] my-[0.5rem]">Matriz de responsabilidades</div>
            <Table aria-label="Example table with custom cells" className="px-[1rem]" removeWrapper>
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={
                                column.uid === "rol4" ? "center" : "start"
                            }
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
