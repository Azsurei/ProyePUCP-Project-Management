// components/TreeGraphComponent.jsx
import React, {useEffect, useState} from 'react';
import { Tree } from 'react-d3-tree';
import { TwitterPicker } from 'react-color';
import {Button, Select, SelectItem} from "@nextui-org/react";
import styles from './custom-tree-styles.css';
import {ChevronRight, ChevronLeft, ZoomIn, ZoomOut} from 'react-feather';

// Define a list of colors for the nodes at different depths
const levelColors = [
    "#FFD700", // Gold
    "#FF8C00", // DarkOrange
    "#FF6347", // Tomato
    "#FF4500", // OrangeRed
    "#FF1493", // DeepPink
    "#DB7093", // PaleVioletRed
    "#B0C4DE", // LightSteelBlue
    "#7B68EE", // MediumSlateBlue
    "#6A5ACD", // SlateBlue
    "#483D8B", // DarkSlateBlue
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

/*
// Update the buildTree function to pass along the depth of each node
const buildTree = (nodeData, depth = 0) => {
    const nodeName = truncateString(`${nodeData.codigo}. ${nodeData.descripcion}`, 15);
    const fill = levelColors[nodeData.depth] || defaultColor;

    // Create the node structure with a depth property
    let node = {
        name: nodeName,
        depth,
        attributes: {
            id: nodeData.id,
            codigo: nodeData.codigo,
            descripcion: nodeData.descripcion,
        },
    };

    // If there are children, recursively build the subtree
    if (nodeData.componentesHijos && nodeData.componentesHijos.length > 0) {
        node.children = nodeData.componentesHijos.map(child => buildTree(child, depth + 1));
    }

    return node;
};

// Function to initiate the tree with a parent node
const convertDataToTree = (data) => {
    // Initial parent node
    const parentNode = {
        name: 'Proyecto', // or any other root name
        depth: 0,
        children: []
    };

    // For each element in the data array, create a child node
    data.forEach(item => {
        parentNode.children.push(buildTree(item, 1)); // Start with depth 1 for children
    });

    return parentNode; // This is the full tree
};
*/
const handleNodeClick = (nodeDatum) => {
    // Your logic here
    console.log('Node clicked', nodeDatum);
};

// Button component for zoom
const ZoomButton = ({ onClick, text }) => (
    <Button
        onClick={onClick}
        style={{
            margin: '4px',
            padding: '8px 16px', // Increased padding
            fontSize: '18px', // Increased font size
            cursor: 'pointer',
            borderRadius: '4px', // Optional: rounded corners
            border: 'none',
            backgroundColor: '#f0f0f0', // Optional: background color
            // Add additional styling as needed
        }}
    >
        {text === "+"? <ZoomIn/> : <ZoomOut/>}
    </Button>
);




const TreeGraphComponent = ({ data }) => {

    // Function to update the tree data with the current colors

    const convertDataToTree = (inputData, colors) => {
        const buildTree = (nodeData, depth = 0) => {
            const nodeName = `${nodeData.codigo}. ${truncateString(nodeData.nombre, 15)}`;
            let node = {
                name: nodeName,
                depth,
                children: nodeData.componentesHijos?.map(child => buildTree(child, depth + 1)) || []
            };
            return node;
        };

        // Initial parent node
        let parentNode = {
            name: 'Proyecto',
            depth: 0,
            children: inputData.map(item => buildTree(item, 1))
        };
        return parentNode;
    };

    const [treeData, setTreeData] = useState(() => convertDataToTree(data, levelColors));
    const [zoomLevel, setZoomLevel] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState('0');
    const [selectedLevelColors, setSelectedLevelColors] = useState(levelColors);
    const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

    // Use useEffect to update the treeData when selectedLevelColors or data changes
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
    const treeTranslateX = isControlsCollapsed ? 200 : 400; // Increase by 100px
    const collapseButtonPositionX = '10px'; // Decrease by 100px

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
        // Get the color based on the depth of the node.
        const fill = selectedLevelColors[nodeDatum.depth] || defaultColor;

        // Calculate width and height of the node based on the text length
        const CHAR_WIDTH = 10; // Width per character
        const textLength = nodeDatum.name.length * CHAR_WIDTH;
        const rectWidth = Math.max(100, textLength + 20); // Minimum width
        const rectHeight = 40; // Height

        return (
            <g>
                {/* Rectangle for the node with a border */}
                <rect
                    width={rectWidth}
                    height={rectHeight}
                    x={-rectWidth / 2}
                    y={-rectHeight / 2}
                    fill={fill}
                    stroke="#000" // Border color set to black
                    strokeWidth="2" // Border width
                    onClick={toggleNode}
                />

                {/* Text label centered in the rectangle */}
                <text
                    fill="#fff" // Text color set to white
                    x="0"
                    y="5" // Adjust this value to better center the text vertically
                    textAnchor="middle"
                    alignmentBaseline="middle" // Ensure the text is centered vertically
                    style={{ fontSize: '14px', fontFamily: 'Montserrat, Arial, Helvetica, sans-serif' }}
                >
                    {nodeDatum.name}
                </text>
            </g>
        );
    };

    return (
        <div id="treeWrapper" style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100vh',
            border: '2px solid #ccc', // Add a border to the main div
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
        }}>

            <div style={{
                display: isControlsCollapsed ? 'none' : 'flex',
                flexDirection: 'column',
                borderRight: '2px solid #ccc',
                padding: '10px',
                minWidth: '250px',
                transition: 'min-width 0.3s ease',
                overflow: 'hidden',
            }}>
                {!isControlsCollapsed && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // Center the child elements
                        borderRight: '2px solid #ccc',
                        padding: '10px',
                        minWidth: '250px',
                    }}>
                        {/* Zoom controls */}
                        <div className="zoom-controls" style={{
                            display: 'flex',
                            flexDirection: 'column', // Stack the buttons vertically
                            alignItems: 'center', // Center the buttons horizontally
                            marginBottom: '20px', // Space between zoom controls and color picker
                        }}>
                            <ZoomButton onClick={handleZoomIn} text="+" />
                            <ZoomButton onClick={handleZoomOut} text="-" />
                        </div>
                    </div>
                )}
            </div>
            <div style={{ flexGrow: 1, overflow: 'auto', position: 'relative' }}>
                {/* Toggle button */}
                <Button
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
            </div>
        </div>
    );
};

export default TreeGraphComponent;