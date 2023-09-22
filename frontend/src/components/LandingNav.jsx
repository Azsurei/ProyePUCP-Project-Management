import React from 'react';
import styles from '@/styles/landing.module.css';

function LandingNav() {
    return (
        <nav className={styles.landingNav}>
            <img src="/images/LogoProyePUCP.png" alt="Logo ProyePUCP" />
            <ul>
                <li><a href="#">¿Qué es ProyePUCP?</a></li>
                <li><a href="#">Servicios</a></li>
                <li><a href="#">Contáctanos</a></li>
            </ul>
            <img src="/images/logoPUCPstandard.png" alt="Logo PUCP" />
        </nav>
    );
}

export default LandingNav;