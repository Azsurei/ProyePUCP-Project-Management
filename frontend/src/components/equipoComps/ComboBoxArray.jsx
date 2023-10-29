"use client";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function ComboBoxArray(people, onSelect) {
    const [selectedPerson, setSelectedPerson] = useState(people[0])
    const [query, setQuery] = useState('')
  
    const filteredPeople =
      query === ''
        ? people
        : people.filter((person) => {
            return person.nombreRol.toLowerCase().includes(query.toLowerCase())
          })
  
    return (
      <Combobox value={selectedPerson} onChange={()=>{
            setSelectedPerson(person)
            onSelect(person)    
      }}>
        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(person) => person.nombreRol}
        />
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Combobox.Options>
            {filteredPeople?.map((person) => (
              <Combobox.Option key={person.idRol} value={person}>
                {person.nombreRol}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </Combobox>
    )
  }