import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '@atlaskit/datetime-picker';


const getCurrentDateFormatted = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TimePicker = () => (
  <>
    
    <DatePicker
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