import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';

import { IconListCheck, IconMail, IconUser } from '@tabler/icons';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import { USER_TOKEN } from 'src/constants/env.contant';
import { logout } from 'src/store/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userInfo } = useSelector(state => state.user);

  const logoutUser =()=>{
    dispatch(logout())
    navigate('/auth/login')
  }

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '231px',
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText sx={{ whiteSpace:"break-spaces"}} >{userInfo?.firstName +" "+userInfo?.lastName ?? "User"}</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button  variant="outlined" color="primary"  fullWidth onClick={logoutUser}>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
