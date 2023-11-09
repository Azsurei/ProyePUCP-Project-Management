"use client";
import React from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { SmallLoadingScreen } from "../layout";
import { useState, useEffect, useContext } from "react";
import { SaveIcon } from "@/components/equipoComps/SaveIcon";
import { CrossWhite } from "@/components/equipoComps/CrossWhite";
import { AddIcon } from "@/components/equipoComps/AddIcon";
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
    const [reList, setReList] = useState(false);

    useEffect(() => {
        // Datos iniciales
        console.log("El id del proyecto es", projectId);
        console.log("El tipo de dato de projectID es", typeof projectId);
        const stringURLInitialDataFromApi =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/matrizResponsabilidad/listarEntregablesXProyecto/" +
            projectId;
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
            .get(stringURLInitialDataFromApi)
            .then(function (response) {
                const initialDataFromApi = response.data.entregables;
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
                                            initialEntregables.forEach(
                                                (entregable) => {
                                                    // Verifica si la combinación de idRol e idEntregable ya existe en dataFromApi
                                                    const existingData =
                                                        initialDataFromApi.find(
                                                            (item) =>
                                                                item.idRol ===
                                                                    rol.id &&
                                                                item.idEntregable ===
                                                                    entregable.id
                                                        );

                                                    if (existingData) {
                                                        // Si existe, simplemente agrega los datos existentes
                                                        completedData.push(
                                                            existingData
                                                        );
                                                    } else {
                                                        // Si no existe, crea una celda vacía o con valores predeterminados
                                                        completedData.push({
                                                            idRol: rol.id,
                                                            nombreRol:
                                                                rol.nombre,
                                                            idEntregable:
                                                                entregable.id,
                                                            nombreEntregable:
                                                                entregable.nombre,
                                                            // Puedes definir valores predeterminados para otras propiedades
                                                            idResponsabilidad: 0,
                                                            nombreResponsabilidad:
                                                                "",
                                                            letraResponsabilidad:
                                                                "",
                                                            colorResponsabilidad:
                                                                "",
                                                            isNew: true, // Marcar como nueva celda
                                                        });
                                                    }
                                                }
                                            );
                                        });
                                        console.log(
                                            "Data from API",
                                            initialDataFromApi
                                        );
                                        console.log("Roles", initialRoles);
                                        console.log(
                                            "Entregables",
                                            initialEntregables
                                        );
                                        console.log(
                                            "Responsabilidades",
                                            initialResponsabilidades
                                        );
                                        // Establecer los datos iniciales en los hooks
                                        setDataFromApi(completedData);
                                        setRoles(initialRoles);
                                        setEntregables(initialEntregables);
                                        setResponsabilidades(
                                            initialResponsabilidades
                                        );
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
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [reList]);

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
        const updatedData = JSON.parse(JSON.stringify(dataFromApi));

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
            //console.log("La celda modificado tiene:", updatedData[rowIndex]);
            //console.log("ModifiedCells tiene:", modifiedCells);

            //ESTA LÓGICA ES PARA CUANDO SOLO NECESITAMOS USAR UNA CELDA, NO MÚLTIPLES

            // Verifica si ya existe un objeto en modifiedCells con el mismo idRol e idEntregable
            const existingModifiedCellIndex = modifiedCells.findIndex(
                (cell) =>
                    cell.idRol === idRol && cell.idEntregable === idEntregable
            );

            if (existingModifiedCellIndex !== -1) {
                // Si ya existe, reemplaza el objeto existente con el objeto actualizado
                const modifiedCellsCopy = [...modifiedCells];
                modifiedCellsCopy[existingModifiedCellIndex] =
                    updatedData[rowIndex];
                setModifiedCells(modifiedCellsCopy);
            } else {
                // Si no existe, agrega la celda modificada a modifiedCells
                setModifiedCells([...modifiedCells, updatedData[rowIndex]]);
            }
        }

        // Actualiza el estado con el nuevo arreglo
        setDataFromApi(updatedData);
    };

    const renderCell = React.useCallback(
        (user, columnKey) => {
            //console.log("El key de la columna es:", columnKey);
            const cellValue = user[columnKey];
            //console.log("El valor de la celda es:", cellValue);
            const color = getColorForResponsabilidad(cellValue);
            //console.log("El color que pondre es", color);
            const entregableMatch = entregables.find(
                (item) => item.nombre === user.entregable
            );

            const idEntregable = entregableMatch ? entregableMatch.id : null;
            //console.log("El id del entregable es:", idEntregable);
            let idRol;
            if (columnKey !== "entregable") {
                const roleMatch = roles.find(
                    (item) => item.nombre === columnKey
                );
                idRol = roleMatch ? roleMatch.id : null;
            } else {
                idRol = -1;
            }
            //console.log("El id del rol es:", idRol);
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
                                        style={{ backgroundColor: color }}
                                        className={`transition-transform hover:shadow-md hover:scale-105 font-bold text-white`}
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
        [dataFromApi]
    );

    const saveFunction = () => {
        const newCells = modifiedCells.filter((cell) => cell.isNew);
        const modifiedExistingCells = modifiedCells.filter(
            (cell) => !cell.isNew
        );
        console.log("Celdas a insertar:", newCells);
        console.log("Celdas a modificar:", modifiedExistingCells);
        const stringURLPostData =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/matrizResponsabilidad/insertarEntregableXResponsabilidadXRol";
        const stringURLPutData =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/matrizResponsabilidad/actualizarEntregables";
        // Crear un arreglo de promesas para las solicitudes POST y PUT
        const postPromise =
            newCells.length > 0
                ? axios.post(stringURLPostData, { celdasInsertar: newCells })
                : null;
        const putPromise =
            modifiedExistingCells.length > 0
                ? axios.put(stringURLPutData, {
                      modifiedExistingCells: modifiedExistingCells,
                  })
                : null;

        // Usar Promise.all para esperar a que ambas promesas se resuelvan
        Promise.all([postPromise, putPromise])
            .then((responses) => {
                // Ambas solicitudes se han completado
                if (postPromise) {
                    console.log(
                        "Respuesta del servidor (POST):",
                        responses[0].data
                    );
                    console.log("Registro correcto (POST)");
                }
                if (putPromise) {
                    console.log(
                        "Respuesta del servidor (PUT):",
                        responses[1].data
                    );
                    console.log("Registro correcto (PUT)");
                }

                setModifiedCells([]);
                if (postPromise || putPromise) {
                    setIsLoadingSmall(true);
                    setReList(!reList);
                }
            })
            .catch((errors) => {
                // Manejar errores si alguna de las solicitudes falla
                if (postPromise) {
                    console.error(
                        "Error al realizar la solicitud POST:",
                        errors[0]
                    );
                }
                if (putPromise) {
                    console.error(
                        "Error al realizar la solicitud PUT:",
                        errors[1]
                    );
                }
            });
    };

    return (
        <>
            <div className="px-[1rem]">
                Inicio/Proyectos/Proyecto/Matriz de responsabilidades
            </div>
            <div className="flex items-center justify-between my-[0.5rem] px-[1rem]">
                <div className="text-[#172B4D] font-semibold text-[2rem]">
                    Matriz de responsabilidades
                </div>
                <div className="flex gap-4">
                    <Button
                        color="primary"
                        startContent={<SaveIcon />}
                        onPress={saveFunction}
                    >
                        Guardar
                    </Button>
                    <Button color="danger" startContent={<CrossWhite />}>
                        Limpiar
                    </Button>
                </div>
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
            <div className="mx-[1rem] ">
                <div className="my-[2rem] p-4 z-0 flex flex-col relative justify-between gap-4 bg-content1 overflow-auto rounded-large shadow-small w-full">
                    <div className="text-[#172B4D] font-semibold text-[1.4rem]">
                        Leyenda
                    </div>
                    <div className="grid grid-cols-12 gap-4 items-center">
                        {responsabilidades.map((responsabilidad) => (
                            <React.Fragment key={responsabilidad.id}>
                                <div
                                    style={{
                                        backgroundColor: responsabilidad.color,
                                    }}
                                    className="col-span-1 border-medium rounded-medium flex justify-center text-white"
                                >
                                    {responsabilidad.letra}
                                </div>
                                <div
                                    style={{ color: responsabilidad.color }}
                                    className="col-span-2 break-words font-medium"
                                >
                                    {responsabilidad.nombre}
                                </div>
                                <div className="col-span-8 break-words">
                                    {responsabilidad.descripcion}
                                </div>
                                <div className="col-span-1">
                                    <img
                                        src="/icons/icon-trash.svg"
                                        alt="delete"
                                        className="mb-4 cursor-pointer"
                                    />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex items-center justify-center my-2">
                        <Button
                            color="warning"
                            auto
                            className="flex items-center justify-center gap-2 text-white text-[1.1rem]"
                            startContent={<AddIcon />}
                        >
                            Agregar responsabilidad
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
