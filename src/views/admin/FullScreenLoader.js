import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const FullScreenLoader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent white background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // ensure it's above other elements
      }}
    >
      <CircularProgress color="primary" size={60} />
    </Box>
  );
};

export default FullScreenLoader;
