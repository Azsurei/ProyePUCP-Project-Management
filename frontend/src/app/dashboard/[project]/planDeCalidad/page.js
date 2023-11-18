"use client"
import axios from "axios";
import { useState, useEffect,useContext } from "react";
import { SmallLoadingScreen } from "../layout";
import { Textarea, Input, Button } from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
axios.defaults.withCredentials = true;

export default function PlanDeCalidad(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);
    return (
        <div>hola</div>
    );
}