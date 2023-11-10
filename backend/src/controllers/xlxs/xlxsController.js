const XLSX = require('xlsx');

function ajustarAnchoDeColumna(hoja, datos) {
    var padding = 2; // Espacio adicional para evitar cortes
    var anchos = hoja['!cols'] || [];
    
    datos.forEach(function(objeto) {
        Object.values(objeto).forEach(function(valor, indiceColumna) {
            var ancho = (valor || "").toString().length + padding;
            anchos[indiceColumna] = anchos[indiceColumna] || { wch: ancho };
            anchos[indiceColumna].wch = Math.max(anchos[indiceColumna].wch, ancho);
        });
    });
    hoja['!cols'] = anchos;
}

function agregarDatosAHoja(wb, header, datosReducidos, nombreHoja) {
    var ws = XLSX.utils.json_to_sheet(datosReducidos);
    XLSX.utils.sheet_add_aoa(ws, header, { origin: 'A1' });
  
    // Calcula el ancho de las columnas antes de añadir los datos
    ajustarAnchoDeColumna(ws, [header[0]].concat(datosReducidos));
  
    XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
  }
  

  function extraerCampos(objetoOArreglo, campos) {
    // Si la entrada es un arreglo, aplicamos la lógica anterior
    if (Array.isArray(objetoOArreglo)) {
      return objetoOArreglo.map(objeto => extraerCamposDeObjeto(objeto, campos));
    } else {
      // Si no es un arreglo, asumimos que es un objeto único
      return [extraerCamposDeObjeto(objetoOArreglo, campos)];
    }
  }
  
  function extraerCamposDeObjeto(objeto, campos) {
    let nuevoObjeto = {};
    campos.forEach(campo => {
      // Esto manejará casos en los que el campo pueda ser un camino de propiedad anidada
      nuevoObjeto[campo] = campo.split('.').reduce((o, k) => (o || {})[k], objeto);
    });
    return nuevoObjeto;
  }
// ver si se elimina xq no se utiliza
  function ajustarRangoDeHoja(ws) {
    // Obtén el rango actual de la hoja
    let rango = XLSX.utils.decode_range(ws['!ref']);
    
    // Encuentra la primera columna con datos
    let primeraColumnaConDatos = rango.s.c; // Comienza con la columna inicial del rango
    for (let C = rango.s.c; C <= rango.e.c; ++C) {
        let columnaTieneDatos = false;
        for (let R = rango.s.r; R <= rango.e.r; ++R) {
            if (ws[XLSX.utils.encode_cell({c: C, r: R})]) {
                columnaTieneDatos = true;
                break;
            }
        }
        if (columnaTieneDatos) {
            primeraColumnaConDatos = C;
            break; // Rompe el bucle en la primera columna con datos
        }
    }

    // Ajusta el rango de la hoja si se encontraron columnas vacías al inicio
    if (primeraColumnaConDatos !== rango.s.c) {
        // Ajusta el inicio del rango a la primera columna con datos
        rango.s.c = primeraColumnaConDatos;
        ws['!ref'] = XLSX.utils.encode_range(rango);
    }
}


module.exports = {
    ajustarAnchoDeColumna,
    agregarDatosAHoja,
    extraerCampos,
    ajustarRangoDeHoja
}