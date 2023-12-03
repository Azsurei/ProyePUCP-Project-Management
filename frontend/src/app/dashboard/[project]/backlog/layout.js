"use client";

import NavigationTab from "@/components/NavigationTab";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Tabs,
    Tab,
} from "@nextui-org/react";
import React, {
    useState,
    useEffect,
    useReducer,
    useContext,
    createContext,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import SaveIcon from "@mui/icons-material/Save";
import { Toaster, toast } from "sonner";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import { SessionContext } from "../../layout";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/productBacklog/plantillaKB.css";
import { set } from "date-fns";
export const FlagRefreshContext = createContext();
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
export default function RootLayout({ children, params }) {
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const [error, setError] = useState(null);

    const pathname = usePathname();
    const router = useRouter();

    const [selectedTab, setSelectedTab] = useState(pathname.split("/")[pathname.split("/").length - 1]);
    useEffect(()=>{
        console.log(pathname);
        console.log("===============================");
        console.log(pathname.split("/")[pathname.split("/").length - 1])
    },[]);

    const decodedProjectName = decodeURIComponent(projectName);
    const constructedUrl = new URL(
        `/dashboard/${decodedProjectName}=${projectId}/backlog/kanban`,
        window.location.origin
    );
    const isKanbanPage = usePathname() === constructedUrl.pathname;
    //Plantillas

    const {
        isOpen: isModalSavePlantilla,
        onOpen: onModalSavePLantilla,
        onOpenChange: onModalSavePlantillaChange,
    } = useDisclosure();

    const {
        isOpen: isModalverPlantillas,
        onOpen: onModalverPlantillas,
        onOpenChange: onModalverPlantillasChange,
    } = useDisclosure();
    const [nombrePlantilla, setNombrePlantilla] = useState("");
    const [validNombrePlantilla, setValidNombrePlantilla] = useState(true);
    const [IdUsuario, setIdUsuario] = useState("");

    //obtener idUsuario
    const { sessionData } = useContext(SessionContext);
    useEffect(() => {
        setIdUsuario(sessionData.idUsuario);
    }, []);

    const savePlantillaKB = () => {
        return new Promise((resolve, reject) => {
            const updateURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/plantillas/guardarPlantillaKanban";

            axios
                .post(updateURL, {
                    nombrePlantilla: nombrePlantilla,
                    idUsuario: IdUsuario,
                    idProyecto: projectId,
                })
                .then((response) => {
                    console.log(response.data.message);
                    resolve(response);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
        });
    };

    const guardarPlantillaNueva = async () => {
        try {
            await toast.promise(savePlantillaKB, {
                loading: "Guardando PsavePlantillalantilla Nueva...",
                success: (data) => {
                    DataTable();
                    return "La plantilla se agregó con éxito!";
                },
                error: "Error al agregar plantilla",
                position: "bottom-right",
            });
        } catch (error) {
            throw error;
        }
    };

    const [plantillas, setPlantillas] = useState([]);
    const [selectedPlantilla, setSelectedPlantilla] = useState(null);

    const DataTable = async () => {
        const fetchPlantillas = async () => {
            try {
                const url =
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/plantillas/listarPlantillasKanban/" +
                    IdUsuario;
                const response = await axios.get(url);
                const plantillasInvertidas =
                    response.data.plantillasKanban.reverse();
                setPlantillas(plantillasInvertidas);
            } catch (error) {
                console.error("Error al obtener las plantillas:", error);
            }
        };
        fetchPlantillas();
    };

    useEffect(() => {
        if (IdUsuario !== "") {
            DataTable();
        }
    }, [IdUsuario]);

    const handlePlantillaClick = (plantilla) => {
        setSelectedPlantilla(plantilla);
        setError(null);
        console.log("Plantilla seleccionada:", plantilla.nombrePlantilla);
    };

    const [flagRefresh, setFlagRefresh] = useState(false);

    const usePlantillaKanban = () => {
        return new Promise((resolve, reject) => {
            console.log("idProyecto:" + projectId);
            console.log(
                "idPlantillaKanban:" + selectedPlantilla.idPlantillaKanban
            );
            const updateData = {
                idProyecto: projectId,
                idPlantillaKanban: selectedPlantilla.idPlantillaKanban,
            };

            const updateURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/plantillas/seleccionarPlantillaKanban";

            axios
                .put(updateURL, updateData)
                .then((response) => {
                    setFlagRefresh(true);
                    resolve(response);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
        });
    };

    const usarPlantilla = async () => {
        try {
            toast.promise(usePlantillaKanban, {
                loading: "Cargando Plantilla...",
                success: (data) => {
                    return "La plantilla se cargó con éxito!";
                },
                error: "Error al usar plantilla",
                position: "bottom-right",
            });
        } catch (error) {
            throw error;
        }
    };
    const [plantillaElegida, setPlantillaElegida] = useState(false);

    //Fin Plantillas

    //Buscar PLantilla
    const [filterValue, setFilterValue] = useState("");
    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    const limpiarInput = () => {
        setFilterValue("");
        DataTable();
    };

    //lamado a la api de listar PLantillas por Nombre

    const refreshList = async () => {
        if (IdUsuario !== "" && filterValue !== "") {
            try {
                const url =
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/plantillas/listarPlantillasKanbanXNombre/" +
                    IdUsuario +
                    "/" +
                    filterValue;

                console.log(IdUsuario + " " + filterValue);
                console.log(url);
                const response = await axios.get(url);

                const plantillasInvertidas = response.data.plantillasKanban;
                console.log(plantillasInvertidas);

                setPlantillas(plantillasInvertidas);
            } catch (error) {
                console.error("Error al obtener las plantillas:", error);
            }
        }
    };

    return (
        <div className="p-[2.5rem] flex flex-col space-y-2 min-w-[100%] min-h-[100%]">
            {isKanbanPage && (
                <Modal
                    size="md"
                    isOpen={isModalSavePlantilla}
                    onOpenChange={onModalSavePlantillaChange}
                >
                    <ModalContent>
                        {(onClose) => {
                            const finalizarModal = async () => {
                                let Isvalid = true;

                                if (nombrePlantilla === "") {
                                    setValidNombrePlantilla(false);
                                    Isvalid = false;
                                }

                                if (Isvalid === true) {
                                    try {
                                        await guardarPlantillaNueva();
                                        setNombrePlantilla("");
                                        setValidNombrePlantilla(true);
                                    } catch (error) {
                                        console.error(
                                            "Error al Guardar Plantilla:",
                                            error
                                        );
                                    }

                                    onClose();
                                }
                            };
                            return (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        Guardado de Plantilla
                                    </ModalHeader>
                                    <ModalBody>
                                        <p
                                            style={{
                                                color: "#494949",
                                                fontSize: "16px",
                                                fontStyle: "normal",
                                                fontWeight: 400,
                                            }}
                                        >
                                            Se guardarán los campos en una
                                            plantilla para poder usarlos en
                                            otros proyectos
                                        </p>

                                        <Input
                                            type="email"
                                            variant={"underlined"}
                                            label="Nombre Plantilla"
                                            value={nombrePlantilla}
                                            onValueChange={setNombrePlantilla}
                                            isInvalid={!validNombrePlantilla}
                                            onChange={() => {
                                                setValidNombrePlantilla(true);
                                            }}
                                            errorMessage={
                                                !validNombrePlantilla
                                                    ? "Ingrese un nombre"
                                                    : ""
                                            }
                                        />

                                        <div></div>
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onClick={() => {
                                                onClose(); // Cierra el modal
                                                setNombrePlantilla("");
                                                setValidNombrePlantilla(true);
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            className="bg-generalBlue text-white font-medium"

                                            onClick={finalizarModal}
                                        >
                                            Guardar Plantilla
                                        </Button>
                                    </ModalFooter>
                                </>
                            );
                        }}
                    </ModalContent>
                </Modal>
            )}

            {isKanbanPage && (
                <Modal
                    size="lg"
                    isOpen={isModalverPlantillas}
                    onOpenChange={onModalverPlantillasChange}
                >
                    <ModalContent>
                        {(onClose) => {
                            const finalizarModalP = async () => {
                                let Isvalid = true;
                                if (selectedPlantilla === null) {
                                    setPlantillaElegida(false);
                                    Isvalid = false;
                                }

                                if (Isvalid === true) {
                                    try {
                                        await usarPlantilla();
                                        setPlantillaElegida(false);
                                    } catch (error) {
                                        console.error(
                                            "Error al Utilizar Plantilla:",
                                            error
                                        );
                                    }
                                    onClose();
                                    DataTable();
                                    setFilterValue("");
                                } else {
                                    setError("Seleccione una plantilla");
                                    console.log("algo pasa xd");
                                }
                            };

                            return (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        Plantillas Kanban
                                    </ModalHeader>
                                    <ModalBody>
                                        <div className="modal-body">
                                            <div
                                                style={{ marginBottom: "25px" }}
                                            >
                                                <p style={{ fontSize: "15px" }}>
                                                    Seleccione una plantilla
                                                    para cargar los campos
                                                </p>
                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                    width: "100%",
                                                    gap: ".6rem",
                                                    marginBottom: "25px",
                                                }}
                                            >
                                                <div className="divBuscador">
                                                    <Input
                                                        isClearable
                                                        className="w-full sm:max-w-[100%]"
                                                        placeholder="Ingresa una plantilla..."
                                                        startContent={
                                                            <SearchIcon />
                                                        }
                                                        value={filterValue}
                                                        onValueChange={
                                                            onSearchChange
                                                        }
                                                        onClear={limpiarInput}
                                                        variant="faded"
                                                    />
                                                </div>
                                                <Button
                                                    className="bg-generalBlue text-white font-medium"
                                                    color="primary"
                                                    onClick={refreshList}
                                                >
                                                    Buscar
                                                </Button>
                                            </div>

                                            <ul className="cardPlantillaKBList">
                                                {plantillas.map((plantilla) => (
                                                    <li
                                                        key={
                                                            plantilla.idPlantillaKanban
                                                        }
                                                    >
                                                        <div
                                                            className={`cardPlantillaKB ${
                                                                selectedPlantilla ===
                                                                plantilla
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                handlePlantillaClick(
                                                                    plantilla
                                                                )
                                                            }
                                                        >
                                                            {
                                                                plantilla.nombrePlantilla
                                                            }
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </ModalBody>

                                    <ModalFooter>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                flex: 1,
                                            }}
                                        >
                                            {error && (
                                                <p
                                                    style={{
                                                        color: "red",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {error}
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            color="danger"
                                            variant="light"
                                            onClick={() => {
                                                onClose(); // Cierra el modal
                                                setSelectedPlantilla(null);
                                                setError(null); // Establece error en null para desactivar el mensaje de error
                                                limpiarInput();
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            className="bg-generalBlue text-white font-medium"
                                            onPress={finalizarModalP}
                                        >
                                            Continuar
                                        </Button>
                                    </ModalFooter>
                                </>
                            );
                        }}
                    </ModalContent>
                </Modal>
            )}

            {/* <HeaderWithButtonsSamePage
                haveReturn={false}
                haveAddNew={false}
                //handlerAddNew={handlerGoToNew}
                //newPrimarySon={ListComps.length + 1}
                breadcrump={
                    "Inicio / Proyectos / " + projectName + " / Backlog"
                }
                //btnText={"Nueva tarea"}
            >
                Backlog
            </HeaderWithButtonsSamePage> */}
            <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem
                                href={"/dashboard/" + projectName + "=" + projectId}
                                    text={projectName}
                    />
                    <BreadcrumbsItem href={"/dashboard/" + projectName + "=" + projectId + "/backlog/kanban"} text="Backlog" />
                </Breadcrumbs>

            <div style={{ display: "flex", flexDirection: "row" }}>
                <Tabs
                    radius="sm"
                    color="primary"
                    className="font-medium"
                    classNames={{
                        cursor: "bg-[#F0AE19]",
                    }}
                    size="lg"
                    selectedKey={selectedTab}
                    onSelectionChange={(e)=>{
                        setSelectedTab(e);
                        if(e === "kanban"){
                            router.push(
                                "/dashboard/" +
                                    projectName +
                                    "=" +
                                    projectId +
                                    "/backlog/kanban"
                            );
                        }
                        if(e === "sprintBacklog"){
                            router.push(
                                "/dashboard/" +
                                    projectName +
                                    "=" +
                                    projectId +
                                    "/backlog/sprintBacklog"
                            );
                        }
                        if(e === "productBacklog"){
                            router.push(
                                "/dashboard/" +
                                    projectName +
                                    "=" +
                                    projectId +
                                    "/backlog/productBacklog"
                            );
                        }
                    }}
                >
                    <Tab
                        key={"kanban"}
                        title="Kanban"
                    />
                    <Tab
                        key={"sprintBacklog"}
                        title="Sprint Backlog"
                    />
                    <Tab
                        key={"productBacklog"}
                        title="Product Backlog"
                    />
                </Tabs>

                {isKanbanPage && (
                    <div
                        style={{
                            display: "flex",
                            marginLeft: "auto",
                            gap: "20px",
                        }}
                    >
                        <Dropdown>
                            <DropdownTrigger>
                                <Button color="secondary">Plantillas</Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                variant="faded"
                                aria-label="Dropdown menu with icons"
                            >
                                <DropdownItem
                                    key="verPlantillaKB"
                                    startContent={<ContentPasteGoIcon />}
                                    onPress={onModalverPlantillas}
                                    color="secondary"
                                >
                                    Ver Plantillas
                                </DropdownItem>
                                <DropdownItem
                                    key="guardarPlantillasKB"
                                    startContent={<SaveAsIcon />}
                                    onPress={onModalSavePLantilla}
                                    color="secondary"
                                >
                                    Guardar Plantilla
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                )}
            </div>

            <FlagRefreshContext.Provider
                value={{ flagRefresh, setFlagRefresh }}
            >
                {children}
            </FlagRefreshContext.Provider>
        </div>
    );
}
