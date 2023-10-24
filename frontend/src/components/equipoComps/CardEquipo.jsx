"use client"

import {
    Card,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";

  import ProgressBar from "@/components/equipoComps/ProgressBar";
  import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
  import "@/styles/dashboardStyles/projectStyles/EquipoStyles/CrearEquipo.css";
  import React, { useState } from "react";
  import PopUpDetEquipo from "./PopUpDetEquipo";

  const CardEquipo = ({
    team,
    handleSeeTeam
  }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
      setModalIsOpen(true);
    }
  
    const closeModal = () => {
      setModalIsOpen(false);
    }

    //Temporal
    let completed = 0;
    let bgcolor = "#ef6c00";

    console.log("Estos son los miembros: " + team.miembros);

    return (
      <div>
        <Card className="w-full max-w-[70rem] h-50 shadow-md 
          border border-gray-300 rounded-lg card-hover my-2 overflow-hidden" onClick={()=>{handleSeeTeam(team)}}>
          <CardBody className="pl-2 pr-2">
            <div className="mt-4 ml-4 mr-16 mb-2 flex items-center justify-between">
              <Typography variant="h6" color="blue-gray" className="font-semibold">
                {team.nombre}
              </Typography>
            </div>
            <p className="text-sm ml-4">Coordinador: {team.coordinador}</p>

              {team.participantes.length > 0 ? (
                <div className="divPictures">
                    {team.participantes.slice(0, 4).map((member, index) => (
                    <p className="membersIcon" key={member.idUsuario}>
                        {member.nombres[0]}
                        {member.apellidos[0]}
                    </p>
                    ))}
                    {team.participantes.length > 4 && (
                      <p className="membersIcon">
                        +{team.participantes.length - 4}
                      </p>
                    )}
                </div>
              ) : (
                  <p className="ml-4">Este equipo no cuenta con miembros</p>
              )}
            
          </CardBody>
          <CardFooter>
            <div className="progressBarContainer">
              <ProgressBar bgcolor={bgcolor} completed={completed} />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  export default CardEquipo;
  
  