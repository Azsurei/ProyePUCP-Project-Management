"use client";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useEffect } from "react";

export default function Example({
    urlApi,
    property,
    nameDisplay,
    hasColor,
    colorProperty,
    onSelect,
    idParam,
    initialName,
    reloadData,
    inputWidth = 64,
    onSelectValor,
    valorParam,
    widthCombo,
    onSelect2,
    isDisabled = false,
}) {
    const [selected, setSelected] = useState("");
    const [query, setQuery] = useState("");
    const [data, setData] = useState([]);
    const [dataWithId, setDataWithId] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(urlApi);
                const dataWithId = response.data[property].map(
                    (item, index) => ({
                        ...item,
                        id: index + 1, // Puedes ajustar esta lógica según tus necesidades
                    })
                );
                setDataWithId(dataWithId);
                setData(response.data[property]);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        fetchData();
        if (reloadData) {
            fetchData();
        }
    }, [reloadData]);

    // const initiaValue = data.find((element) => element[idParam] === initialID);
    // console.log(initiaValue? initiaValue[nameDisplay] : "No hay datos");
    // const [inputBase, setInputBase] = useState(initiaValue ? initiaValue[nameDisplay] : "");
    // console.log(inputBase);
    // console.log("fin");

    const filteredData =
        query === ""
            ? data
            : data.filter((object) =>
                  object[nameDisplay]
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );
    setTimeout(() => {
        // Cambia el estado o realiza alguna operación aquí si es necesario
    }, 10000);
    return (
        <div>
            <Combobox
                value={selected}
                onChange={(selectedItem) => {
                    setSelected(selectedItem);
                    if (typeof onSelect === "function") {
                        onSelect(selectedItem[idParam]);
                    }
                    if (typeof onSelectValor === "function") {
                        onSelectValor(selectedItem[valorParam]);
                    }
                    if (typeof onSelect2 === "function") {
                        onSelect2(
                            selectedItem[idParam],
                            selectedItem[valorParam]
                        );
                    }
                }}
            >
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                            className={`w-${inputWidth} border-2 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-white focus:ring-0`}
                            style={{
                                ...(widthCombo
                                    ? { width: `${widthCombo}rem` }
                                    : {}),
                                ...(hasColor
                                    ? {
                                          backgroundColor:
                                              selected[colorProperty],
                                      }
                                    : {}),
                            }}
                            displayValue={(object) => object[nameDisplay]} //lo que se muestra en el input
                            onChange={(event) => {
                                setQuery(event.target.value);
                            }}
                            {...(selected === "" ? { value: initialName } : {})}
                            readOnly={isDisabled}
                        />
                        {!isDisabled && (
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400 dark:text-white"
                                    aria-hidden="true"
                                />
                            </Combobox.Button>
                        )}
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-[#3b3b3b] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-30">
                            {filteredData?.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-white">
                                    Nada encontrado.
                                </div>
                            ) : (
                                filteredData?.map((object, index) => (
                                    <Combobox.Option
                                        key={index}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active
                                                    ? "bg-teal-600 dark:bg-slate-700 text-white"
                                                    : "text-gray-900 dark:text-white"
                                            }`
                                        }
                                        value={object}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? "font-medium"
                                                            : "font-normal"
                                                    }`}
                                                >
                                                    {object[nameDisplay]}{" "}
                                                    {/* //lo que se muestra en la lista */}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                            active
                                                                ? "text-white"
                                                                : "text-teal-600 dark:text-slate-700"
                                                        }`}
                                                    >
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    );
}
