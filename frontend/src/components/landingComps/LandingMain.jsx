import React from "react";
import Button from "@/components/Button";
import styles from "@/styles/landing.module.css";

function LandingMain() {
    return (
        <main className={styles.landingMain}>
            <div className={styles.landingText}>
                <h1>La manera más fácil de gestionar tus proyectos</h1>
                <p>
                    ProyePUCP es la mejor plataforma educativa que te proveerá
                    de todas las herramientas que necesites para gestionar tus
                    proyectos.
                </p>
                <Button 
                    appearance="default"
                    text="¡Inicia ya!" 
                    href={"/login"} 
                    className={'w-52'}/>
            </div>
            <img src="/images/LogoStart.png" alt="StartImage" />
        </main>
    );
}

export default LandingMain;
