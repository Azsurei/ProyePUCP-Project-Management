import React from "react";

const CardTemplate = ({
    imageSrc,
    iconSrc,
    title,
    description,
    dateCreated,
}) => {
    return (
        <div className="flex flex-col items-center h-80 justify-between w-full">
            <img src={imageSrc} alt="Thumbnail" className="w-52 h-52 mb-4" />
            <div className="flex flex-row items-center w-full h-full">
                <img src={iconSrc} alt="Icon" className="w-6 h-6 mr-4" />
                <div className="flex flex-col items-start w-full overflow-hidden whitespace-nowrap">
                    <h2 className="text-lg font-medium truncate w-full">
                        {title}
                    </h2>
                    <p className="text-gray-600 truncate w-full">
                        {description}
                    </p>
                </div>
            </div>
            <p className="text-gray-500 text-sm">{`Creado el: ${dateCreated}`}</p>
        </div>
    );
};

export default CardTemplate;
