import { useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListUsers.css";
axios.defaults.withCredentials = true;

function cardUser(props) {
  return (
    <li className="ToolCard" onClick={props.onClick}>
        <p className="titleUser">{props.name}</p>
        <p className="titleUser">{props.lastName}</p>
        <p className="titleUser">{props.email}</p>
    </li>
  );
}

export default function ListUsers(props) {
  const router = useRouter();


  return (
    <ul className="ListUsersProject">
      {props.lista.map((component) => {
        return (
          <cardUser
            key={component.id}
            name={component.name}
            lastName={component.lastName}
            email={component.email}
          ></cardUser>
        );
      })}
    </ul>
  );
}
