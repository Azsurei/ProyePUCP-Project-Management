import React from "react";
import '@/styles/Placeholder.css';

function Placeholder({ attribute, handleChange, param }) {
    return (
        <div>
            <input 
                id={attribute.id}
                name={attribute.name}
                placeholder={attribute.placeholder}
                type={attribute.type}
                onChange={(e)=> handleChange(e.target.name,e.target.value)}
                className={param? "input-error" : "input"} 
            />
        </div>
    );
}

export default Placeholder;