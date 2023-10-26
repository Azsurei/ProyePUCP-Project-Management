"use client";

import Link from "next/link";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import ListProject from "@/components/dashboardComps/projectComps/projectCreateComps/ListProject";
import axios from "axios";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

axios.defaults.withCredentials = true;

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
} from "@nextui-org/react";
import { SearchIcon } from "@/../public/icons/SearchIcon";



export default function Dashboard() {

    const [filterValue, setFilterValue] = useState("");
    const [listUsers, setListUsers] = useState([]);
    const { data: session, status} = useSession();
    console.log(session);

    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    return (
        <div className="mainDiv">
            <div className="headerDiv">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                </Breadcrumbs>
                <p className="textProject2">Proyectos</p>
            </div>

            <div className="divSearch">
                <div className="divBuscador">
                            <Input
                                isClearable
                                className="w-full sm:max-w-[80%]"
                                placeholder="Buscar Proyecto..."
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onValueChange={onSearchChange}
                                variant="faded"
                            />
                        </div>  

                <div className="contentDer">
                    <p className="textProject">¿Tienes ya la idea ganadora?</p>

                    <div className="butonAddProject">
                        <Link href="/dashboard/newProject" id="newProBtnContainer">
                            <button className="addProjectbtn">
                                Crear Proyecto
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <ListProject></ListProject>
        </div>
    );
}
