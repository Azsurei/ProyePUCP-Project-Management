import React from 'react';



import { DatePicker } from '@atlaskit/datetime-picker';
import { parseISO } from 'date-fns';


const getCurrentDateFormatted = () => {
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, '0');
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const year = now.getFullYear();
  return `${year}-${month}-${day}`;
};

const DatePicker1 = ({onChange}) => (
  <>
    
    <DatePicker
      locale={'es-PE'}
      dateFormat="DD-MM-YYYY"
      placeholder={getCurrentDateFormatted()}
      onChange={onChange}
      selectProps={{
        inputId: 'default-date-picker-example',
      }}
    />
  </>
);

export default DatePicker1;