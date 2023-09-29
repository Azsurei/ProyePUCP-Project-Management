import React from 'react';
import '../../../../styles/dashboardStyles/projectStyles/actaConstStyles/AtributoCard.css';
export default function AtributoCard ({atributo, valor}){
    return (
        <div className="info">
            <div className="atributo">{atributo}</div>
            <div className="valor">{valor}</div>
        </div>
    )
};
