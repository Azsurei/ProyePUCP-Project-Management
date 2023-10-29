"use client"
import { useContext, useEffect } from "react";
import { SmallLoadingScreen } from "../../layout";

export default function Kanban(){
    const {setIsLoadingSmall} = useContext(SmallLoadingScreen);

    useEffect(()=>{
        setIsLoadingSmall(false);
    },[]);

    return(
        <div>
            test
        </div>
    );
}