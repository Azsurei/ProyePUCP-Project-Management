import React from "react";
import MyCombobox from "@/components/ComboBox";

const CardEquipo = ({
    iconSrc,
    nombre,
    correo,
}) => {
    return (
        <div className="flex flex-col items-start justify-between w-500">
            <div className="flex flex-row items-center w-full h-full">
                <img src={iconSrc} alt="Icon" className="w-6 h-6 mr-4" />
                <div className="flex flex-col items-start w-full overflow-hidden whitespace-nowrap">
                    <h2 className="text-lg font-medium truncate w-full">
                        {nombre}
                    </h2>
                    <p className="text-gray-600 truncate w-full">
                        {correo}
                    </p>
                </div>
                <div className="items-left">
                    <MyCombobox />
                </div>
            </div>
        </div>
    );
};

export default CardEquipo;
