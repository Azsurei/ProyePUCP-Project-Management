import React from 'react';
import IconLabel from './IconLabel';

function BacklogRow({ index, hu, toggleModal }) {
  return (
    <tr key={index} className="bg-gray-50 border-t">
      <td className="px-4 py-2 text-xl text-gray-700 whitespace-nowrap ">{hu.descripcion}</td>
      <td className="px-4 py-2 text-xl text-gray-700 whitespace-nowrap ">{hu.epic}</td>
      <td className="px-4 py-2 text-lg text-gray-700 whitespace-nowrap ">
        <span className="p-1.5 text-sm font-sm uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50">{hu.priority}</span>
      </td>
      <td className="px-4 py-2 text-lg text-gray-700 whitespace-nowrap ">
        <span className="p-1.5 text-sm font-medium uppercase tracking-wider text-gray-800 bg-gray-200 rounded-lg bg-opacity-50">{hu.state}</span>
      </td>
      <td className="items-center whitespace-nowrap" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
        <IconLabel icon="/icons/editar.svg" className="iconEdition" />
      </td>
      <td className="items-center whitespace-nowrap" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
        <button onClick={() => toggleModal(hu)}>
          <IconLabel icon="/icons/eliminar.svg" className="iconElimination" />
        </button>
      </td>
    </tr>
  );
}

export default BacklogRow;





