import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js'; // Import CryptoJS library

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import * as AuthApi from  "../../../apis/auth.api"
import { toast } from 'react-toastify';
import { CRYPTO_SECRET_KEY, USER_TOKEN } from 'src/constants/env.contant';
import { useDispatch } from 'react-redux';
import { updateUserDetails } from 'src/store/user/userSlice';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' }); // State for errors
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (formData.password.trim().length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trim(), // Trim whitespace from input
    }));
  };

  const handleSubmit = async (e) => {
    try {
        e.preventDefault();

        if (!validateForm()) {
          return; // If form is not valid, stop submission
        }

        setLoading(true); // Start loader
    
        // Encrypt password
        const encryptedPassword = CryptoJS.AES.encrypt(
          formData.password.trim(),
          CRYPTO_SECRET_KEY,
        ).toString();
    
        const userDetails = { email: formData.email, password: encryptedPassword }
    
        const loginResponse  = await AuthApi.login(userDetails)
    
        if(loginResponse?.status){
            toast.success(loginResponse?.msg)
            dispatch(updateUserDetails(loginResponse))
            localStorage.setItem(USER_TOKEN,loginResponse?.token)
            localStorage.setItem("userId",loginResponse?.user["_id"])
            if(loginResponse?.user["role"] == "admin"){
              navigate("/admin-homepage")
            }else{
              navigate("/dashboard")
            }
        }else if(loginResponse?.msg){
                toast.error(loginResponse?.msg)
        }
        setLoading(false);
    } catch (error) {
        console.log("error while submitting login form",error)
        setLoading(false);
    }

  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <form onSubmit={handleSubmit}>
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="username"
              mb="5px"
            >
              Username
            </Typography>
            <CustomTextField
              id="username"
              name="email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Box>
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Password
            </Typography>
            <CustomTextField
              id="password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Remember this Device"
              />
            </FormGroup>
            {/* <Typography
              component={Link}
              to="/"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
              }}
            >
              Forgot Password ?
            </Typography> */}
          </Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={loading} // Disable button if loading
          >
            {loading ? 'Loading...' : 'Sign In'}
          </Button>
        </Box>
      </form>
      {subtitle}
    </>
  );
};

export default AuthLogin;
