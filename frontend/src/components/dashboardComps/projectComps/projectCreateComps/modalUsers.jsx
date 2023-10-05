import React from 'react';
import { useEffect, useState } from "react";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/modalUser.css";
import ListUsers from './ListUsers';
import axios from "axios";
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


export default function ModalUser({ modal,toggle}) {
    const [filterValue, setFilterValue] = React.useState("");

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue("");
        }
    }, []);
    const [listUsers, setListUsers] = useState([]);
    

    function refreshList(){
        let usersArray;
        const stringURL =
          "http://localhost:8080/api/usuario/listarUsuarios";
        axios
          .post(stringURL, {
            nombreCorreo: filterValue
          })

          .then(function (response) {
            console.log(response);
            usersArray = response.data.usuarios;
    
            usersArray = usersArray.map((user) => {
              return {
                id: user.idUsuario,
                name: user.nombres,
                lastName: user.apellidos,
                email: user.correElectronico,
              };
            });
    
            setListUsers(usersArray);
    
            console.log(usersArray);
          })
          .catch(function (error) {
            console.log(error);
          });

    }

    useEffect(() => {
        refreshList();
      }, []);


    return (
    <>    
        
        <div className="modalUser">

        
            <p className="buscarSup">
            Buscar a un supervisor
            </p>

            <div className="divBuscador">
                <Input
                            isClearable
                            className="w-full sm:max-w-[80%]"
                            placeholder="Ingresa un miembro..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={() => onClear()}
                            onValueChange={onSearchChange}
                            variant='faded'
                        />
                {/* <Button size="sm" variant="flat" color="primary">
                    Buscar
                </Button> */}

                <button className="buttonOneUser" >Buscar</button>
            </div>

            <div className="divUsers">
                    <ListUsers lista={listUsers}></ListUsers>
            </div>

            <div className="endButtons">
                <button className="buttonTwoUser">Cancelar</button>
                <button className="buttonOneUser">Confirmar</button>
            </div>

        </div>


    </>
    )
}