"use client";
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import ButtonPanel from "@/components/dashboardComps/projectComps/appConstComps/ButtonPanel";
import Button from "@/components/dashboardComps/projectComps/appConstComps/Button";
import React, { useState, useEffect, useReducer } from 'react';
import EditIcon from '../../../../../../public/images/EditIcon.svg';
import DocumentFilledIcon from '../../../../../../public/images/DocumentFilledIcon.svg';
import CrossIcon from '../../../../../../public/images/CrossIcon.svg';
import axios from 'axios';
import {error} from "next/dist/build/output/log";

const itemsBreadCrumb = ['Inicio', 'Proyectos', 'Nombre del proyecto', 'Acta de Constitución'];
axios.defaults.withCredentials = true;
export default function Info() {
    const [IsCancelling, setIsCancelling] = useState(false);
    const [IsEditingHere, setIsEditingHere] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // NEW: State to track loading
    const [showSaveCancel, setShowSaveCancel] = useState(false);
    const [errorState, setErrorState] = useState(null);  // Error state for handling and displaying errors.

    const initialState = {
        projectData: [],
        purpouseData: [],
        descriptionData: [],
        budgetData: [],
        restrictionData: [],
        highLevelRisksData: [],
        projectApprovalData: [],
        highLevelRequirementsData: [],
        productRequirementsData: [],
        projectRequirementsData: [],
        elaboratedByData: []
    };

    const arrayData = ["projectData", /*...*/ "elaboratedByData"];

    const dataReducer = (state, action) => {
        switch (action.type) {
            case 'UPDATE_PROJECT_DATA':
                return { ...state, projectData: action.payload };
            case 'UPDATE_PURPOUSE_DATA':
                return { ...state, purpouseData: action.payload };
            case 'UPDATE_DESCRIPTION_DATA':
                return { ...state, descriptionData: action.payload };
            case 'UPDATE_BUDGET_DATA':
                return { ...state, budgetData: action.payload };
            case 'UPDATE_RESTRICTION_DATA':
                return { ...state, restrictionData: action.payload };
            case 'UPDATE_HIGH_LEVEL_RISKS_DATA':
                return { ...state, highLevelRisksData: action.payload };
            case 'UPDATE_PROJECT_APPROVAL_DATA':
                return { ...state, projectApprovalData: action.payload };
            case 'UPDATE_HIGH_LEVEL_REQUIREMENTS_DATA':
                return { ...state, highLevelRequirementsData: action.payload };
            case 'UPDATE_PRODUCT_REQUIREMENTS_DATA':
                return { ...state, productRequirementsData: action.payload };
            case 'UPDATE_PROJECT_REQUIREMENTS_DATA':
                return { ...state, projectRequirementsData: action.payload };
            case 'UPDATE_ELABORATED_BY_DATA':
                return { ...state, elaboratedByData: action.payload };
            case 'RESET_TO_INITIAL':
                return { ...initialState };  // This resets the state back to the initial state.
            default:
                return state;
        }
    };


    const [dataState, dispatch] = useReducer(dataReducer, initialState, undefined);

    // NEW: Fetch project details when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/getProjectDetails'); // Adjust the endpoint accordingly
                dispatch({ type: 'SET_INITIAL_DATA', payload: response.data });
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    /* ... (rest of the existing functions) ... */
    const handleEditClick = () => {
        setIsEditingHere(true);      // Set to editing mode.
        setShowSaveCancel(true);    // Show the save and cancel buttons.
    };
    const handleCancelClick = () => {
        setIsEditingHere(false);     // Exit editing mode.
        setShowSaveCancel(false);   // Hide the save and cancel buttons.
        setIsCancelling(true);      // Set cancelling mode (this might trigger some additional UI changes or behaviors).
        dispatch({ type: 'RESET_TO_INITIAL', payload: initialState });  // Reset the data to its initial state.
    };

    const handleSaveClick = async () => {
        try {
            const response = await axios.put('/api/updateProjectDetails', dataState); // Adjust the endpoint and data format accordingly
            if (response.status === 200) {
                alert('Data saved successfully');
                setIsEditingHere(false);
                setShowSaveCancel(false);
                setIsCancelling(false);
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {isLoading ? (
                <div>Loading...</div>  // Display a loading message while data is being fetched
            ) : (
                <>
                    <ButtonPanel margin="20px 20px 20px" align="left">
                        <Button appearance="primary" state="default" spacing="compact" onClick={handleEditClick}>
                            <div>
                                <EditIcon />
                                <div>Editar</div>
                            </div>
                        </Button>
                    </ButtonPanel>

                    {cardDataArray.map((card, index) => (
                        <TextInfoCard
                            key={index}
                            title={card.title}
                            data={dataState[arrayData[index]]}
                            isEditing={IsEditingHere}
                            isCancel={IsCancelling}
                            handleDataChange={handleDataChange}
                            dataKey={index}
                        />
                    ))}

                    <ButtonPanel margin="20px 20px 20px" align="center" style={{ display: showSaveCancel ? 'flex' : 'none' }}>
                        <Button appearance="subtle" state="default" spacing="compact" onClick={handleCancelClick}>
                            <div>
                                <CrossIcon />
                                <div>Cancelar</div>
                            </div>
                        </Button>
                        <Button appearance="primary" state="default" spacing="compact" onClick={handleSaveClick}>
                            <div>
                                <DocumentFilledIcon />
                                <div>Guardar</div>
                            </div>
                        </Button>
                    </ButtonPanel>
                </>
            )}
            {error && <div>Error: {error.message}</div>}  // Display error message if there's an error
        </div>
    );

}
