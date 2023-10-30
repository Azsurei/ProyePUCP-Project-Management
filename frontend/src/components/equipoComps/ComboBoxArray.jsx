"use client";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function ComboBoxArray({ people, onSelect }) {
    const [selectedPerson, setSelectedPerson] = useState("");
    const [query, setQuery] = useState("");

    const filteredPeople =
        query === ""
            ? people
            : people.filter((person) => {
                  return person.nombreRol
                      .toLowerCase()
                      .includes(query.toLowerCase());
              });

    return (
        <div>
            {/* <div className="absolute right-16 top-1/2 transform -translate-y-1/2"> */}
            <Combobox
                value={selectedPerson}
                onChange={(selectedItem) => {
                    setSelectedPerson(selectedItem);
                    if (typeof onSelect === "function") {
                        onSelect(selectedItem);
                    }
                }}
            >
                <div className="relative mt-1">
                    <div className="relative w-80 cursor-default overflow-hidden rounded-lg bg-white text-left  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                            className={`w-80 border-2 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0`}
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(person) => person.nombreRol}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
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
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-30">
                            {filteredPeople?.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Nada encontrado.
                                </div>
                            ) : (
                                filteredPeople?.map((person, index) => (
                                    <Combobox.Option
                                        key={index}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active
                                                    ? "bg-teal-600 text-white"
                                                    : "text-gray-900"
                                            }`
                                        }
                                        value={person}
                                    >
                                        {({ selectedPerson, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selectedPerson
                                                            ? "font-medium"
                                                            : "font-normal"
                                                    }`}
                                                >
                                                    {person.nombreRol}{" "}
                                                    {/* //lo que se muestra en la lista */}
                                                </span>
                                                {selectedPerson ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                            active
                                                                ? "text-white"
                                                                : "text-teal-600"
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
