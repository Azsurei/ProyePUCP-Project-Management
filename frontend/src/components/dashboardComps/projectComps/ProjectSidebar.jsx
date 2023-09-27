import React from "react";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";

const memberData = [
    {
        id: '1',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    },
    
    {
        id: '5',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    },
    {
        id: '6',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    }  ,
    {
        id: '6',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    } ,
    {
        id: '6',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    } ,
    {
        id: '6',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    }
];

function MemberIcon(props){
    return(
        <li className="memberContainer">
            <img 
                // src={props.profilePicture} 
                src="/images/ronaldo_user.png"
                alt="/icons/userDefaultIcon.png" 
                className="memberIcon"/>
        </li>
    );
}

function ProjectSidebar() {
    return (
        <nav className='ProjectSidebar'>
            <div>
                <p className="header">Los Dibujitos</p>
                <p className="dates">13/09/2023  -  20/10/2023 (50 dias)</p>
                <div className="teamContainer">
                    <p className="teamHeader">Equipo:</p>
                    <p className="teamName">Los dibujitos</p>
                </div>
            </div>

            <div className="btnOpenSidebar"></div>

            <ul className='members'>
                {memberData.map((member)=>{
                    return <MemberIcon 
                            name={member.name}
                            lastName={member.lastName}
                            profilePicture={member.profilePicture}
                            key={member.id}>
                    </MemberIcon>;
                })}
            </ul>
            <ul className="dropdown-menus">
                Desplegable 1
            </ul>
            <ul>
                Desplegable 2
            </ul>
        </nav>
    );
}

export default ProjectSidebar;