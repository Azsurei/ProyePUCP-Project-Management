// components/TreeGraphComponent.jsx
import React from 'react';
import {Tree} from 'react-tree-graph';
import 'react-tree-graph/dist/style.css'; // Import default styles
import './custom-tree-styles.css'; // Your custom styles to override default ones

// Helper function to truncate strings to a maximum length
const truncateString = (str, num) => {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
};

// Recursive function to build the tree
const buildTree = (node) => {
    const nodeName = truncateString(`${node.codigo} ${node.nombre}`, 15);
    return {
        name: nodeName,
        children: node.componentesHijos?.map(childNode => buildTree(childNode)) || []
    };
};

// Function to convert your data to the expected format by react-tree-graph
const convertDataToTree = (data) => {
    // Filter out the root nodes (nodes with 'idElementoPadre' equal to 1)
    const rootNodes = data.filter(node => node.idElementoPadre === 1);

    // Build the tree from each root node
    const trees = rootNodes.map(rootNode => buildTree(rootNode));

    // If there's only one tree, return it, otherwise create a virtual root node
    if (trees.length === 1) {
        return trees[0];
    } else {
        return {
            name: 'Inicio',
            children: trees
        };
    }
};

// The main component to render the tree
const TreeGraphComponent = ({ data }) => {
    const treeData = convertDataToTree(data);

    return (
        <Tree
            data={treeData}
            height={400}
            width={600}
            animated={true}
            svgProps={{
                className: 'custom' // Your custom class to style with TailwindCSS
            }}
        />
    );
};

export default TreeGraphComponent;