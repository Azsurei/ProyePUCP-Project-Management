"use client";
import "@/styles/NavigationTab.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavigationTab({ listNames, listGoTo }) {
    //componente que recibe una lista de nombres y una lista de hrefs
    //orientado a usar para navegar dentro de un directorio de multiples paginas como backlog
    //ademas, recibe un width para ajustar el largo general del boton, asi se aplica a todos los botones y se ve uniforme
    const router = useRouter();

    const btnWidth = "165px";
    const [currentActive, setCurrentActive] = useState(listNames[0]);

    const normalStyle =
        "navigationTabButton border border-gray-300 py-[7px] rounded-md bg-white flex justify-center";
    const activeStyle =
        "border border-gray-300 py-[7px] rounded-md bg-F0AE19 flex justify-center text-white font-normal cursor-pointer";

    return (
        <div className="flex font-[Roboto] font-medium flex-row space-x-3">
            {listNames.map((item, index) => {
                return (
                        <div
                            key={index}
                            className={
                                currentActive === item
                                    ? activeStyle
                                    : normalStyle
                            }
                            style={{ width: btnWidth }}
                            onClick={() => {
                                setCurrentActive(item);
                                router.push(listGoTo[index])
                            }}
                        >
                            {item}
                        </div>
                );
            })}
        </div>
    );
}
