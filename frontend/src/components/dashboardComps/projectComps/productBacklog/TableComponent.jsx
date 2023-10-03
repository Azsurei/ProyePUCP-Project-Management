import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
axios.defaults.withCredentials = true;
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import ButtonEliminateIcon from './ButtonEliminateIcon';
function TableComponent({ /*urlApi*/ data , columns, toggleModal, rowComponent}) {

    //const [data, setData] = useState([]);


    /*useEffect(() => {
        const fetchData = async () => {
          try {
            // Realiza la solicitud HTTP al endpoint del router
            const response = await axios.get(urlApi);
    
            // Actualiza el estado 'data' con los datos recibidos
            setData(response.data.HUs);
    
            console.log(`Datos obtenidos exitosamente:`, response.data.HUs);
          } catch (error) {
            console.error('Error al obtener datos:', error);
          }
        };
    
        fetchData();
      }, []);*/
  return (
    <div className="tableBacklog overflow-x-auto  overflow-y-auto rounded-lg shadow w-100 sm:max-h-[300px] md:max-h-[400px] lg:max-h-[600px]">
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
                        {data.map((hu, index) => (
                        /*<tr key={index} className="bg-gray-50 border-t">
                            <td className="px-4 py-2 text-xl text-gray-700 whitespace-nowrap ">{hu.descripcion}</td>
                            <td className="px-4 py-2 text-xl text-gray-700 whitespace-nowrap ">{hu.epic}</td>
                            <td className=" px-4 py-2 text-lg text-gray-700 whitespace-nowrap ">
                                <span className="p-1.5 text-sm font-sm uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50">{hu.priority}</span>
                            </td>
                            <td className=" px-4 py-2 text-lg text-gray-700 whitespace-nowrap ">
                                <span className="p-1.5 text-sm font-medium uppercase tracking-wider text-gray-800 bg-gray-200 rounded-lg bg-opacity-50">{hu.state}</span>
                            </td>
                            <td className=" items-center whitespace-nowrap " style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                <IconLabel icon="/icons/editar.svg" className="iconEdition"/>
                            </td>
                            <td className=" items-center whitespace-nowrap " style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                <button onClick={() => toggleModal(hu)}>
                                <IconLabel icon="/icons/eliminar.svg" className="iconElimination"/>
                                </button>

                                
                            </td>
                            
                        </tr>*/
                        React.createElement(rowComponent, { key: index, hu, toggleModal })
                        ))}
                    </tbody>
                    </table>
                </div>
            
  );
}

export default TableComponent;