const cron = require('node-cron');
const axios = require('axios');
const monedaController = require("../controllers/presupuesto/monedaController");
// Este es el formato de cron: 'segundos minutos horas día-mes mes día-semana'
const CRON_SCHEDULE = '59 23 * * *';  // Esto se traduce a las 11:59 PM todos los días
const ACCES_KEY = "d398a72749098ce7be96f996ae802b70";


async function updateExchangeRates() {
  try {
    // Reemplaza 'YOUR_API_KEY' con tu clave API real y ajusta los parámetros según sea necesario
    const response = await axios.get(`http://api.exchangeratesapi.io/v1/latest?access_key=${ACCES_KEY}&symbols=USD,PEN`);
    console.log(response.data);
    if (response.data && response.data.rates) {
      // Aquí deberías llamar a la función que actualiza tu base de datos
      // Por ejemplo: updateDatabase(response.data.rates);
        let EUR2USD = response.data.rates.USD;
        let EUR2PEN = response.data.rates.PEN;
        let USD2PEN = EUR2PEN/EUR2USD;
        USD2PEN = Number(USD2PEN.toFixed(6));
        console.log(EUR2USD);
        console.log(EUR2PEN);
        console.log(USD2PEN);
        monedaController.actualizarTipoCambio(EUR2PEN,USD2PEN);
      //console.log('Tasas de cambio actualizadas:', response.data.rates);
    }
  } catch (error) {
    console.error('Error al actualizar las tasas de cambio:', error);
  }
}

// Función para iniciar el cron job
function startCronJob() {
    cron.schedule(CRON_SCHEDULE, updateExchangeRates);
    console.log(`Cron job scheduled for every day at 23:59. Schedule: ${CRON_SCHEDULE}`);
}

module.exports = startCronJob;