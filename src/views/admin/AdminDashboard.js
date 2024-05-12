import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  TextField,
  InputAdornment,
  CssBaseline,
  Avatar,
  CircularProgress,
  Chip,
  Typography,
} from '@mui/material';

import PageContainer from 'src/components/container/PageContainer';

import UserTable from './UserTable';

const AdminDashboard = () => {

  return (
    <PageContainer title="Admin Dashboard" description="this is Admin Dashboard">
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <UserTable />
      </Box>
    </PageContainer>
  );
};

export default AdminDashboard;
