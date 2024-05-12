import React from 'react';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import Logo from 'src/layouts/full/shared/logo/Logo';

const IntroCard = ({children}) => {

  return (
    <Card
      sx={{ padding: 0 }}
      elevation={9}
      variant={undefined}
    >
      <CardContent>
      <Logo />
      {children}
      </CardContent>
    </Card>
  );
};

export default IntroCard;
