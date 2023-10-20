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
    id,
    nombre,
    coordinador,
    //bgcolor
    //completed
    miembros,
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

    return (
      <div>
        <Card className="w-full max-w-[20rem] h-34 shadow-md 
          border border-gray-300 rounded-lg card-hover my-2 overflow-hidden" onClick={openModal}>
          <CardBody className="pl-2 pr-2">
            <div className="mt-4 ml-4 mr-16 mb-2 flex items-center justify-between">
              <Typography variant="h5" color="blue-gray" className="font-semibold">
                {nombre}
              </Typography>
            </div>
            <Typography color="gray" className="mt-2 ml-4 card-text-hover">
              {coordinador}
              </Typography>
          </CardBody>
          <CardFooter className="pt-2">
            <div className="progressBarContainer">
              <ProgressBar key={id} bgcolor={bgcolor} completed={completed} />
            </div>
          </CardFooter>
        </Card>
        {modalIsOpen && <PopUpDetEquipo closeModal={closeModal} teamName={nombre} coordinador={coordinador} miembros={miembros} />}
      </div>
    );
  };
  
  export default CardEquipo;
  
  