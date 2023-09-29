import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '@atlaskit/datetime-picker';

const TimePicker = () => (
  <>
    <Label htmlFor="default-date-picker-example"></Label>
    <DatePicker
      selectProps={{
        inputId: 'default-date-picker-example',
      }}
    />
  </>
);

export default TimePicker;