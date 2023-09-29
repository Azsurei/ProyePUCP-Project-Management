import React from 'react';
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/newProjects.css";
import { useEffect, useState } from "react";
import React, { Component } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
axios.defaults.withCredentials = true;

export default function CardSelectTools(props) {
    return (

        
        <div>

            <div className="divProjectNameDiv">
                    <p className="projectNametxt">Seleccione las herramientas</p>
            </div>
            

        </div>
    
    )
}