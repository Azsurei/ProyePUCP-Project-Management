//  2023-10-25T05:00:00.000Z a 25/10/2023
export function dbDateToDisplayDate(dbDate) {
    if(dbDate === "0000-00-00"){
        return "";
    }
    const formattedDate = new Date(dbDate);
    // return formattedDate.toLocaleDateString();
    //return formattedDate.toISOString().split("T")[0];
    const isoString = formattedDate.toISOString().split("T")[0];
    return `${isoString.slice(8, 10)}/${isoString.slice(
        5,
        7
    )}/${isoString.slice(0, 4)}`;
}

//  2023-10-25T05:00:00.000Z a 2023-10-25
export function dbDateToInputDate(dbDate) {
    if(dbDate === "0000-00-00"){
        return "";
    }
    const fecha = new Date(dbDate);

    // const year = fecha.getFullYear();
    // const month = String(fecha.getMonth() + 1).padStart(2, "0");
    // const day = String(fecha.getDate()).padStart(2, "0");
    return fecha.toISOString().split("T")[0];

    // Formatear la fecha en el formato deseado (YYYY-MM-DD)
    // return `${year}-${month}-${day}`;
}

// 6/10/2023 a 2023-10-06
export function displayDateToInputDate(displayDate) {
    const partesFecha = displayDate.split("/");

    // Crear una nueva fecha en el formato "mes/día/año"
    const fecha = new Date(
        `${partesFecha[1]}/${partesFecha[0]}/${partesFecha[2]}`
    );

    // Obtener los componentes (año, mes y día) de la nueva fecha
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");

    // Formatear la fecha en el formato deseado (YYYY-MM-DD)
    return `${year}-${month}-${day}`;
}

// 2023-10-06 a 6/10/2023
export function inputDateToDisplayDate(inputDate) {

    const parts = inputDate.split("-");

    // Rearrange the parts to form "DD/MM/YYYY"
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
