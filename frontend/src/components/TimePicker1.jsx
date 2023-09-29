import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '@atlaskit/datetime-picker';
import { parseISO } from 'date-fns';


const getCurrentDateFormatted = () => {
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, '0');
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const year = now.getFullYear();
  return `${year}-${month}-${day}`;
};

const TimePicker = () => (
  <>
    
    <DatePicker
      locale={'es-PE'}
      dateFormat="DD-MM-YYYY"
      defaultValue={getCurrentDateFormatted()}
      placeholder={getCurrentDateFormatted()}
      
      selectProps={{
        inputId: 'default-date-picker-example',
      }}
    />
  </>
);

export default TimePicker;