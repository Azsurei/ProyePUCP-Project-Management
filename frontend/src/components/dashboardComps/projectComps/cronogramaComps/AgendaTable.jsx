"use client";
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
    Button,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { useCallback } from "react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import GroupUserIcons from "./GroupUserIcons";
import { VerticalDotsIcon } from "public/icons/VerticalDotsIcon";

const columns = [
    { name: "TAREA", uid: "name" },
    { name: "ASIGNADO (S)", uid: "usuarios" },
    { name: "ESTADO", uid: "status" },
    { name: "DURACION", uid: "fechaFin" },
    { name: "ACTIONS", uid: "actions" },
];

const users = [
    {
        id: 1,
        name: "Hacer cronograma",
        txtAdicional: "2 subtareas | 1 tarea posterior",
        usuarios: "Backend",
        status: "progress",
        fechaFin: "27/03/2023",
    },
    {
        id: 2,
        name: "Sacar 20",
        txtAdicional: "",
        usuarios: "Backend",
        status: "No iniciado",
        fechaFin: "27/03/2023",
    },
    {
        id: 3,
        name: "Terminar parciales",
        txtAdicional: "3 subtareas",
        usuarios: [],
        status: "finalizado",
        fechaFin: "27/03/2023",
    },
];

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
    atrasado: "warning",
    finalizado: "success",
    progress: "primary"
};

export default function AgendaTable({ listTareas }) {

    const taskList = listTareas.map((tarea) => {
        const strSubtareas = tarea.cantSubTareas !== 0 ? tarea.cantSubTareas+" Subtareas" : "";
        const strTareaPosterior = tarea.cantPosteriores !== 0 ? tarea.cantPosteriores+" Tarea posterior" : "";
        let strAd;
        if(tarea.cantSubTareas !== 0 && tarea.cantPosteriores !== 0){
            strAd = strSubtareas + " | " + strTareaPosterior;
        }
        else if(tarea.cantSubTareas !== 0 && tarea.cantPosteriores === 0){
            strAd = strSubtareas;
        }
        else if(tarea.cantSubTareas === 0 && tarea.cantPosteriores !== 0){
            strAd = strTareaPosterior;
        }
        else{
            strAd = "";
        }

        //const usuariosAtr = tarea.equipo === falta ver
        const formattedStartDate = new Date(tarea.fechaInicio);
        const formattedEndDate = new Date(tarea.fechaFin);
        const duracion = formattedStartDate.toLocaleDateString() + " - " + formattedEndDate.toLocaleDateString();
        return {
            id: tarea.idTarea,
            name: tarea.sumillaTarea,
            txtAdicional: strAd,
            //usuarios: "",
            status: tarea.nombreTareaEstado, //falta agregar color, se logra facil trayendo el color desde bd
            fechaFin: duracion
        };
    });


    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {cellValue}
                        </p>
                        <p className="text-bold text-sm capitalize text-default-400">
                            {user.txtAdicional}
                        </p>
                    </div>
                );
            case "usuarios":
                if (Array.isArray(cellValue)) {
                    return (
                        <div style={{ width: "auto", display: "flex" }}>
                            <GroupUserIcons></GroupUserIcons>
                        </div>
                    );
                } else {
                    return (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: ".5rem",
                            }}
                        >
                            <img
                                src="/icons/sideBarDropDown_icons/sbdd14.svg"
                                alt=""
                                className=""
                            />
                            <p style={{ fontSize: "1rem", fontWeight: "500" }}>
                                Equipo Backend
                            </p>
                        </div>
                    );
                }
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[user.status]}
                        size="sm"
                        variant="flat"
                    >
                        {cellValue}
                    </Chip>
                );
            case "fechaFin":
                return <div>{cellValue}</div>;
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem>Ver detalle</DropdownItem>
                                <DropdownItem>Editar</DropdownItem>
                                <DropdownItem>Eliminar</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <Table aria-label="Example table with custom cells" className="mt-4">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={taskList} emptyContent={"El proyecto no tiene tareas."}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
