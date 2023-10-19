import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "@/styles/dashboardStyles/projectStyles/presupuesto/presupuesto.css";
function createData(name, month1, month2, month3, month4,month5,month6) {
  return { name, month1, month2, month3, month4,month5,month6 };
}

const rows = [
  createData('Ingresos'),
  createData('Préstamo', 1500, 1500, 1500, 1500,1500,1500),
  createData('Pago Cliente', 2000, 1500, 1500, 1500,1500,1500),
  createData('Donaciones', 2000, 1500, 1500, 1500,1500,1500),
  createData('Total Ingresos', 2000, 1500, 1500, 1500,1500,1500),
  createData('Egresos'),
  createData('Jefe de Proyecto', 1500, 1500, 1500, 1500,1500,1500),
  createData('Ingenierio Industrial', 2000, 1500, 1500, 1500,1500,1500),
  createData('Licencia Bizagi', 2000, 1500, 1500, 1500,1500,1500),
  createData('Transporte', 2000, 1500, 1500, 1500,1500,1500),
  createData('Total Egresos', 2000, 1500, 1500, 1500,1500,1500),
  createData('Total Acumulado', 2000, 1500, 1500, 1500,1500,1500)
];

const TableBudget = () => {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Enero</TableCell>
            <TableCell align="right">Febrero</TableCell>
            <TableCell align="right">Marzo</TableCell>
            <TableCell align="right">Abril</TableCell>
            <TableCell align="right">Mayo</TableCell>
            <TableCell align="right">Junio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
          <TableCell component="th" scope="row" style={
                  (row.name === 'Ingresos' || row.name === 'Egresos')
                    ? { fontWeight: 'bold', color: '#172B4D', fontFamily: 'Roboto' ,fontStyle: 'italic', width: '20px'}
                    : (row.name === 'Total Ingresos' || row.name === 'Total Egresos' || row.name === 'Total Acumulado')
                    ? { backgroundColor: 'gray', color: 'white', width: '100px' }
                    : { fontWeight: 'bold', color: '#172B4D', fontFamily: 'Roboto', paddingLeft: '30px' ,fontStyle: 'italic',width: '200px'}
                }>
                {row.name}
              </TableCell>

              
              <TableCell align="right">{row.month1}</TableCell>
              <TableCell align="right">{row.month2}</TableCell>
              <TableCell align="right">{row.month3}</TableCell>
              <TableCell align="right">{row.month4}</TableCell>
              <TableCell align="right">{row.month5}</TableCell>
              <TableCell align="right">{row.month6}</TableCell>
            </TableRow>
          ))}
        </TableBody>


      </Table>
    </TableContainer>
  );
};

export default TableBudget;
