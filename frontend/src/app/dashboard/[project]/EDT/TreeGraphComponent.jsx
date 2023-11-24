// components/TreeGraphComponent.jsx
import React, {useContext, useEffect, useState} from 'react';
import { Tree } from 'react-d3-tree';
import { TwitterPicker } from 'react-color';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger, Input, Modal, ModalBody,
    ModalContent, ModalFooter, ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import {ChevronRight, ChevronLeft, ZoomIn, ZoomOut} from 'react-feather';
import {OpenMenuContext} from "@/components/dashboardComps/projectComps/EDTComps/EDTVisualization";
import axios from "axios";

const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const levelColors = [
    "#FF0000", // Bright Red
    "#00FF00", // Lime Green
    "#0000FF", // Bright Blue
    "#FFD700", // Deep Yellow
    "#FF69B4", // Hot Pink
    "#4169E1", // Royal Blue
    "#006400", // Dark Green
    "#FFA500", // Orange
    "#9400D3", // Dark Violet
    "#00FFFF", // Cyan
];

// This array will represent levels for the dropdown
const levelItems = levelColors.map((color, index) => ({
    label: `Nivel ${index + 1}`,
    value: index.toString(), // The value should be a string
}));

const defaultColor = "#20B2AA"; // LightSeaGreen for default

const truncateString = (str, num) => {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
};

const TreeGraphComponent = ({ projectName, data }) => {

    const { openMenuId, toggleMenu, handlerGoToNew, handleVerDetalle } =
        useContext(OpenMenuContext);

    const convertDataToTree = (inputData, colors) => {
        const buildTree = (nodeData, depth = 0) => {
            const nodeName = `${nodeData.codigo}. ${truncateString(nodeData.nombre, 15)}`;
            let node = {
                id: nodeData.idComponente,
                codigo: nodeData.codigo,
                name: nodeName,
                nextSon: nodeData.nextSon,
                depth,
                children: nodeData.componentesHijos?.map(child => buildTree(child, depth + 1)) || []
            };
            return node;
        };

        // Initial parent node
        let parentNode = {
            id: 0,
            codigo: "0",
            name: projectName,
            depth: 0,
            nextSon: "0",
            children: inputData.map(item => buildTree(item, 1))
        };
        return parentNode;
    };

    const [treeData, setTreeData] = useState(() => convertDataToTree(data, levelColors));
    const [zoomLevel, setZoomLevel] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState('0');
    const [selectedLevelColors, setSelectedLevelColors] = useState(levelColors);
    const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

    useEffect(() => {
        setTreeData(convertDataToTree(data, selectedLevelColors));
    }, [data, selectedLevelColors]);

    // Handle color change for levels
    const handleChangeComplete = (color) => {
        const newColors = [...selectedLevelColors];
        const level = parseInt(selectedLevel, 10);

        // Update the color for all nodes at the selected level
        for (let i = 0; i < newColors.length; i++) {
            if (i === level) {
                newColors[i] = color.hex;
            }
        }

        setSelectedLevelColors(newColors);
    };
    const treeTranslateX = isControlsCollapsed ? 200 : 400;
    const collapseButtonPositionX = '10px';

    const toggleControls = () => {
        setIsControlsCollapsed(!isControlsCollapsed);
    };

    const handleZoomIn = () => {
        setZoomLevel(zoom => zoom * 1.2); // 20% zoom in
    };

    const handleZoomOut = () => {
        setZoomLevel(zoom => zoom / 1.2); // 20% zoom out
    };

    const handleLevelChange = (value) => {
        setSelectedLevel(value);
    };

    const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
        const fill = selectedLevelColors[nodeDatum.depth] || defaultColor;
        const CHAR_WIDTH = 10;
        const textLength = nodeDatum.name.length * CHAR_WIDTH;
        const rectWidth = Math.max(100, textLength + 20);
        const rectHeight = 40;

        if (nodeDatum.id > 0) {
            return (
                <Dropdown>
                    <DropdownTrigger>
                        <g onClick={toggleNode}>
                            <rect
                                width={rectWidth}
                                height={rectHeight}
                                x={-rectWidth / 2}
                                y={-rectHeight / 2}
                                fill={fill}
                                stroke="#000"
                                strokeWidth="2"
                            />
                            <text
                                fill="#fff"
                                x="0"
                                y="5"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                style={{fontSize: '14px', fontFamily: 'Montserrat, Arial, Helvetica, sans-serif'}}
                            >
                                {nodeDatum.name}
                            </text>
                        </g>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="droMenTareas"
                        onAction={(key) => {
                            if (key === "add") {
                                handlerGoToNew(nodeDatum.nextSon, nodeDatum.id);
                            }
                            if (key === "view") {
                                handleVerDetalle(nodeDatum.id);
                            }
                            if (key === "delete") {
                                mostrarModalConfirmacion(
                                    nodeDatum.id,
                                    nodeDatum.codigo
                                );
                            }
                        }}
                    >
                        <DropdownItem key={"add"}>Agregar subcomponente</DropdownItem>
                        <DropdownItem key={"view"}>Ver detalle</DropdownItem>
                        <DropdownItem
                            key={"delete"}
                            color="danger"
                            className="text-danger"
                        >
                            Eliminar
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            );
        }else{
            return (
            <g onClick={toggleNode}>
                <rect
                    width={rectWidth}
                    height={rectHeight}
                    x={-rectWidth / 2}
                    y={-rectHeight / 2}
                    fill={fill}
                    stroke="#000"
                    strokeWidth="2"
                />
                <text
                    fill="#fff"
                    x="0"
                    y="5"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    style={{fontSize: '14px', fontFamily: 'Montserrat, Arial, Helvetica, sans-serif'}}
                >
                    {nodeDatum.name}
                </text>
            </g>
            );
        }
    };

    // Modal logic
    const [idAEliminar, setIdAEliminar] = useState(null);
    const [codAEliminar, setCodAEliminar] = useState(null);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const mostrarModalConfirmacion = (idComp, codComp) => {
        setIdAEliminar(idComp);
        setCodAEliminar(codComp);
        onOpen();
    };

    const confirmarModalEliminacion = () => {
        console.log("Procediendo con insertar el componente");
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/EDT/eliminarComponenteEDT",
                {
                    idComponente: idAEliminar,
                    codigo: codAEliminar,
                }
            )
            .then(function (response) {
                console.log(response);
                window.location.reload();
            })
            .catch(function (error) {
                console.log(error);
            });

    };

/*
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredNodes, setFilteredNodes] = useState([]);


    const filterTreeData = (tree, query) => {

        console.log(node);
        const nodeMatchesQuery = (node) => node.nombre.toLowerCase().includes(query.toLowerCase());

        let matches = [];

        if (node.children) {
            node.children = node.children
                .map(child => {
                    const result = filterTreeData(child, query);
                    if (result) matches.push(...result);
                    return result ? child : null;
                })
                .filter(child => child !== null);
        }

        if (nodeMatchesQuery(node)) {
            matches.push(node);
        }

        return matches.length > 0 ? matches : null;
    };

    useEffect(() => {

        let filteredMatches = [];
        if (searchQuery) {
            const results = filterTreeData(treeData, searchQuery);
            if (results) filteredMatches = results;
        }
        setFilteredNodes(filteredMatches);

        setTreeData(convertDataToTree(data, selectedLevelColors));
    }, [searchQuery, data, selectedLevelColors]);
*/
    return (
        <div id="treeWrapper" style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '80vh',
            border: '2px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
        }}>

            <div style={{
                display: isControlsCollapsed ? 'flex' : 'none',
                flexDirection: 'column',
                borderRight: '2px solid #ccc',
                padding: '10px',
                minWidth: '250px',
                transition: 'min-width 0.3s ease',
                overflow: 'hidden',
            }}>
                {/*
                <Input
                    label="Búsqueda"
                    placeholder="Ingrese nombre del componente"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                />

                <div>
                    {filteredNodes.map(node => (
                        <div key={node.id} style={cardStyle} className="node-card">
                            <p className="text-black ">{node.name}</p>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button>Ver opciones</Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="droMenTareas"
                                    onAction={(key) => {
                                        if (key === "add") {
                                            handlerGoToNew(nodeDatum.nextSon, nodeDatum.id);
                                        }
                                        if (key === "view") {
                                            handleVerDetalle(nodeDatum.id);
                                        }
                                        if (key === "delete") {
                                            mostrarModalConfirmacion(
                                                nodeDatum.id,
                                                nodeDatum.codigo
                                            );
                                        }
                                    }}
                                >
                                    <DropdownItem key={"add"}>Agregar subcomponente</DropdownItem>
                                    <DropdownItem key={"view"}>Ver detalle</DropdownItem>
                                    <DropdownItem
                                        key={"delete"}
                                        color="danger"
                                        className="text-danger"
                                    >
                                        Eliminar
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    ))}
                </div> */}
            </div>
            <div style={{ flexGrow: 1, overflow: 'auto', position: 'relative' }}>
                {/* Toggle button */}
                {/*<Button
                    auto
                    flat
                    onClick={toggleControls}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: collapseButtonPositionX, // Adjust button position
                        zIndex: 10,
                        transition: 'left 0.5s ease'
                    }}
                >
                    {isControlsCollapsed ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
                </Button>
                */}
                <Tree
                    data={treeData}
                    orientation="vertical"
                    pathFunc="straight"
                    translate={{ x: treeTranslateX, y: 100 }} // Adjust tree position
                    scaleExtent={{ min: 0.1, max: 4 }}
                    zoom={zoomLevel}
                    renderCustomNodeElement={renderCustomNodeElement}
                    collapsible={false}
                />

                <div className="zoom-controls" style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    zIndex: 10,
                }}>
                    <Button
                        auto
                        flat
                        onClick={handleZoomIn}
                        style={{ marginRight: '10px' }}
                    >
                        <ZoomIn />
                    </Button>
                    <Button auto flat onClick={handleZoomOut}>
                        <ZoomOut />
                    </Button>
                </div>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-red-500">
                                {"Eliminar componente"}
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    {
                                        "¿Seguro que quiere eliminar este componente de su EDT?"
                                    }
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cerrar
                                </Button>

                                <Button
                                    className="bg-indigo-950 text-slate-50"
                                    onPress={() => {
                                        confirmarModalEliminacion();
                                    }}
                                >
                                    Continuar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default TreeGraphComponent;