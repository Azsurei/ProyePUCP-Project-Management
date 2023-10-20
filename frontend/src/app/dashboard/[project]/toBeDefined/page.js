"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SmallLoadingScreen } from "../layout";
axios.defaults.withCredentials = true;
import { Button, Avatar, AvatarGroup, Card, Spacer } from '@nextui-org/react';
import { Transition } from '@headlessui/react';
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";

export default function toBeDefined(props) {
    return(
        <div>
            Not implemented
        </div>
    );
}
