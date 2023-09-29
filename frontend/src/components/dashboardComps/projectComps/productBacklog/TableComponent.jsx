import React from 'react';
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
function TableComponent({ data , columns, toggleModal}) {
  return (
    <div className="tableBacklog overflow-x-auto  rounded-lg shadow w-100">
                    <table className="table table-hover min-w-full">
                    
                    <thead className="bg-blue-300 border-b-2 border-gray-200">
                        
                        <tr>
                            {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className={column.className}
                            >
                            {column.name}
                        </th>
            ))}
                            
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((value, index) => (
                        <tr key={index} className="bg-gray-50 border-t">
                            <td className="px-4 py-2 text-xl text-gray-700 whitespace-nowrap ">{value.name}</td>
                            <td className="px-4 py-2 text-xl text-gray-700 whitespace-nowrap ">{value.epic}</td>
                            <td className=" px-4 py-2 text-lg text-gray-700 whitespace-nowrap ">
                                <span className="p-1.5 text-sm font-sm uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50">{value.priority}</span>
                            </td>
                            <td className=" px-4 py-2 text-lg text-gray-700 whitespace-nowrap ">
                                <span className="p-1.5 text-sm font-medium uppercase tracking-wider text-gray-800 bg-gray-200 rounded-lg bg-opacity-50">{value.state}</span>
                            </td>
                            <td className=" items-center whitespace-nowrap " style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                <IconLabel icon="/icons/editar.svg" className="iconEdition"/>
                            </td>
                            <td className=" items-center whitespace-nowrap " style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                <button onClick={() => toggleModal(value)}>
                                <IconLabel icon="/icons/eliminar.svg" className="iconElimination"/>
                                </button>

                               
                            </td>
                            
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            
  );
}

export default TableComponent;