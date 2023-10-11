"use client";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default function GeneralLoadingScreen({isLoading}) {
    const screenStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        zIndex: "999999",
        backgroundColor: "white"
    };

    const titleStyle = {
        fontFamily: "Montserrat",
        fontSize: "4rem",
        color: "lightgray",
        fontWeight: "700",
    };

    if(isLoading){
        return (
            <div style={screenStyle} className="generalLoadingScreen">
                <p style={titleStyle}>ProyePUCP</p>
    
                <Box sx={{ width: "300px", color: "lightgray" }}>
                    <LinearProgress color="inherit" />
                </Box>
            </div>
        );
    }
    else{
        return null;
    }
    
}
