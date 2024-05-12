import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
  } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40rem',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ShowPersonalizedInfoModal({showPersonalizedInfo, setShowPersonalizedInfo,userClicked}) {

    console.log("user clicked details ", userClicked)

  const handleClose = () => setShowPersonalizedInfo(false);

  return (
    <div>
      <Modal
        open={showPersonalizedInfo}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Typography variant='h4' mb={2}>Personalized Information</Typography>
          {userClicked?.["user_personalized_data"] && userClicked?.["user_personalized_data"].map((data, index) => (
        <Box key={index} sx={{ maxHeight:"30rem", overflow:"hidden" }}>
          {Object.entries(data).map(([key, value]) => (
            key !== 'personalized_data' && (
              <Typography key={key} variant="subtitle2" fontWeight={600} sx={{ lineBreak:"anywhere"}}>
                {JSON.stringify(key)}: {JSON.stringify(value)}
              </Typography>
            )
          ))}
        </Box>
      ))}
        </Box>
      </Modal>
    </div>
  );
}