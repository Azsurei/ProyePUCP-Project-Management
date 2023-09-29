import React from 'react';
import { Box, xcss } from '@atlaskit/primitives';
import { ProgressTracker } from '@atlaskit/progress-tracker';

const containerStyles = xcss({
  maxWidth: '480px',
  margin: 'auto',
});

const CustomizableProgressTracker = ({ items }) => (
  <Box xcss={containerStyles}>
    <ProgressTracker items={items} spacing="comfortable" />
  </Box>
);

export default CustomizableProgressTracker;