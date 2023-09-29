"use client";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/newProjects.css";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

import TimePicker1 from "@/components/TimePicker1";

import Link from "next/link";
import { useState } from "react";
import * as React from "react";
import TracerNewProject from "@/components/TracerNewProject";
import { useRouter } from "next/navigation";
import TextField from "@/components/TextField";

axios.defaults.withCredentials = true;

export default function newProject() {

    const items = [
        {
          id: '1',
          label: 'Informacion General',
          percentageComplete: 0,
          status: 'current',
          href: '#',
        },
        {
          id: '2',
          label: 'Herramientas',
          percentageComplete: 0,
          status: 'unvisited',
          href: '#',
        },
        {
          id: '3',
          label: 'Participantes',
          percentageComplete: 0,
          status: 'unvisited',
          href: '#',
        },
      
      ];
      

  const router = useRouter();

  const [nombreCurso, setCourse] = useState("");
  const [nombreProyecto, setNameproject] = useState("");
  const [dueñoProyecto, setOwner] = useState("");

  /*
    const axiosOptions = {
        method: "post", // El método de solicitud puede variar según tus necesidades
        url: "http://localhost:8080/api/auth/login",
        headers: {
            "Content-Type": "application/json",
        },
        // Otros parámetros de la solicitud, como los datos JSON, deben agregarse aquí
    };
    */

  function handleChange(name, value) {
    if (name == "nombreCurso") {
      setNameproject(value);
    } else if (name == "nombreProyecto") {
      setCourse(value);
    } else if (name == "dueñoProyecto") {
      setOwner(value);
    }
  }

  return (
    <div className="mainDiv">
      <div className="headerDiv">
        <Breadcrumbs>
          <BreadcrumbsItem href="/" text="Inicio" />
          <BreadcrumbsItem href="/dashboard" text="Proyectos" />
          <BreadcrumbsItem href="/dashboard/newProject" text="Nuevo Proyecto" />
        </Breadcrumbs>
        <p className="textProject2">Crea un Proyecto</p>
      </div>

      <div className="trackerBar">
        <TracerNewProject items={items}></TracerNewProject>
      </div>

      <div className="containerInfoBox">
        <div className="infoBox">
          <div className="divProjectNameDiv">
            <p className="projectNametxt">Nombre del Proyecto</p>
          </div>

          <div>
            <TextField></TextField>
          </div>

          <div className="divProjectNameDiv">
            <p className="projectNametxt">Dueño del Proyecto</p>
          </div>
          <TextField></TextField>

          <div className="divProjectNameDiv">
            <p className="projectNametxt">Fecha Inicio</p>
          </div>
          <TimePicker1></TimePicker1>

          <div className="divProjectNameDiv">
            <p className="projectNametxt">Fecha Fin</p>
          </div>
          <TimePicker1></TimePicker1>


        </div>
            <div className="buttonContainer">
                <a href="/dashboard/newProject">
                    <button className="myButton">
                        <svg xmlns="http://www.w3.org/2000/svg" width="79" height="79" viewBox="0 0 79 79" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M72.4173 39.5007C72.4173 57.68 57.68 72.4173 39.5007 72.4173C21.3213 72.4173 6.58398 57.68 6.58398 39.5007C6.58398 21.3213 21.3213 6.58398 39.5007 6.58398C57.68 6.58398 72.4173 21.3213 72.4173 39.5007ZM33.1683 30.8626C33.3346 31.2601 33.5782 31.6206 33.8851 31.9232L41.5448 39.5171L33.9147 47.078C33.6079 47.3806 33.3642 47.7411 33.1979 48.1387C33.0316 48.5362 32.946 48.9628 32.946 49.3937C32.946 49.8246 33.0316 50.2513 33.1979 50.6488C33.3642 51.0463 33.6079 51.4069 33.9147 51.7094C34.537 52.3245 35.3768 52.6695 36.2518 52.6695C37.1268 52.6695 37.9665 52.3245 38.5889 51.7094L48.3157 42.0648C48.6521 41.7313 48.9191 41.3344 49.1013 40.8971C49.2836 40.4598 49.3774 39.9908 49.3774 39.5171C49.3774 39.0434 49.2836 38.5743 49.1013 38.137C48.9191 37.6998 48.6521 37.3029 48.3157 36.9693L38.5559 27.2918C37.9338 26.6777 37.0947 26.3334 36.2205 26.3334C35.3463 26.3334 34.5073 26.6777 33.8851 27.2918C33.5782 27.5944 33.3346 27.9549 33.1683 28.3524C33.002 28.75 32.9164 29.1766 32.9164 29.6075C32.9164 30.0384 33.002 30.4651 33.1683 30.8626Z" fill="#F0AE19"/>
                        </svg>
                    </button>
                </a>
            </div> 
      </div>
    </div>
  );
}
