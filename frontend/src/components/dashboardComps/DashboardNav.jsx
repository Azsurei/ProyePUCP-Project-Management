import React from "react";
import Link from "next/link";
import "@/styles/dashboardStyles/DashboardNav.css";

function DashboardNav() {
    return (
        <nav className='DashboardNav'>
            <img src="/icons/logoProyePUCP_en_svg.svg" alt="" className="proyePucpLogo" />
            <img src="/icons/bars.svg" alt="" className='iconHam' /*onClick={() => setOpen(!isOpen)}*//>
            
                <ul className='NavIconList'>
                    <li>
                        <img src="/icons/icon-help.svg" alt="" className="icon" />
                        <p>Ayuda</p>
                    </li>
                    <li>
                        <img src="/icons/icon-settings.svg" alt="" className="icon" />
                        <p>Configuración</p>
                    </li>
                    <li>
                        <img src="/icons/icon-notif.svg" alt="" className="icon" />
                        <p>Notificaciones</p>
                    </li>
                    <li>
                        <Link href='/dashboard/templates'><img src="/icons/icon-usr.svg" alt="" className="icon" id='icnUser'/></Link>
                        <p>Mi perfil</p>
                    </li>
                </ul>

            {/*isOpen && isMobile && (<NavDropdown></NavDropdown>)*/}
        </nav>
    );
}

export default DashboardNav;