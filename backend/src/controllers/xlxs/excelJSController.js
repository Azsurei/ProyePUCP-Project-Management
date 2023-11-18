async function convertISOToDate(ISOString) {
    const date = new Date(ISOString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Enero es 0
    const year = date.getUTCFullYear();
  
    return `${day}/${month}/${year}`;
  }

async function agregaHeader(WS,filaActual,header,style,borderStyle){
    WS.getRow(filaActual).values = header;
    WS.getRow(filaActual).eachCell({ includeEmpty: true }, (cell) => {
        cell.style = {...style, border: borderStyle};
    });
    filaActual++;
    return filaActual;
}

function ajustarAnchoColumnas(WSRiesgos) {
    WSRiesgos.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        let cellLength = cell.value ? cell.value.toString().length : 0;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2; // Establece un mínimo y agrega un poco de espacio extra
    });
  }

module.exports = {
    agregaHeader,
    convertISOToDate,
    ajustarAnchoColumnas
}