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
} from "@nextui-org/react";
import { useCallback } from "react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import GroupUserIcons from "./GroupUserIcons";

const columns = [
    { name: "TAREA", uid: "name" },
    { name: "ASIGNADO (S)", uid: "role" },
    { name: "ESTADO", uid: "status" },
    { name: "FECHA FIN", uid: "fechaFin" },
    { name: "ACTIONS", uid: "actions" },
];

const users = [
    {
        id: 1,
        name: "Hacer cronograma",
        role: "CEO",
        team: "2 subtareas | 1 tarea posterior",
        status: "En progreso",
        age: "29",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "tony.reichert@example.com",
        fechaFin: "27/03/2023"
    },
    {
        id: 2,
        name: "Sacar 20",
        role: "Technical Lead",
        team: "",
        status: "No iniciado",
        age: "25",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        email: "zoey.lang@example.com",
        fechaFin: "27/03/2023"
    },
    {
        id: 3,
        name: "Terminar parciales",
        role: "Senior Developer",
        team: "3 subtareas",
        status: "finalizado",
        age: "22",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        email: "jane.fisher@example.com",
        fechaFin: "27/03/2023"
    },
    {
        id: 4,
        name: "Realizar validacion de datos",
        role: "Community Manager",
        team: "",
        status: "atrasado",
        age: "28",
        avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
        email: "william.howard@example.com",
        fechaFin: "27/03/2023"
    },
    {
        id: 5,
        name: "Esforzarse en ProyePUCP",
        //subequipo: "Backend team",
        role: "subequipo",
        team: "5 tareas posteriores",
        status: "finalizado",
        age: "24",
        avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
        email: "kristen.cooper@example.com",
        fechaFin: "27/03/2023"
    },
];

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
    atrasado: "warning",
    finalizado: "success",
};

export default function AgendaTable() {
    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "fechaFin":
                return(
                    <div>{cellValue}</div>
                );
            case "subequipo":
                return <div>HOLAAAAA</div>;
            case "name":
                return (
                    // <User
                    //     description={user.email}
                    //     name={cellValue}
                    //     avatar={false}
                    //     avatarProps={{
                    //         src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                    //         isBordered: true,
                    //         isDisabled: true
                    //       }}
                    // >
                    //     {user.email}
                    // </User>
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {cellValue}
                        </p>
                        <p className="text-bold text-sm capitalize text-default-400">
                            {user.team}
                        </p>
                    </div>
                );
            case "role":
                if(cellValue==="subequipo"){
                    return <p style={{fontSize:'1rem',fontWeight:'500'}}>Equipo Backend</p>
                }
                return (
                    // <div className="flex flex-col">
                    //     <p className="text-bold text-sm capitalize">
                    //         {cellValue}
                    //     </p>
                    //     <p className="text-bold text-sm capitalize text-default-400">
                    //         {user.team}
                    //     </p>
                    // </div>
                    <div style={{ width: "auto", display: "flex" }}>
                        <GroupUserIcons></GroupUserIcons>
                    </div>
                );
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
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon />
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit user">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <Table aria-label="Example table with custom cells">
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
            <TableBody items={users}>
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
