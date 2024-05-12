import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import * as AuthApi from '../../../apis/auth.api'

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { CRYPTO_SECRET_KEY, USER_TOKEN } from 'src/constants/env.contant';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateUserDetails } from 'src/store/user/userSlice';

const AuthRegister = ({ title, subtitle, subtext }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Validation
            if (!formData.firstName.trim() || !formData.lastName.trim()) {
                toast.error('Please fill in First Name and Last Name.');
                setLoading(false);
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
                toast.error('Please enter a valid email address.');
                setLoading(false);
                return;
            }

            if (formData.password.trim().length < 8) {
                toast.error('Password must be at least 8 characters long.');
                setLoading(false);
                return;
            }

            // Encrypt password
            const encryptedPassword = CryptoJS.AES.encrypt(formData.password.trim(), CRYPTO_SECRET_KEY).toString();
            // Prepare data for API call
            const requestData = {
                ...formData,
                password: encryptedPassword,
                role: "user"
            };

            const registerResp = await AuthApi.register(requestData)
            if(registerResp?.status){
                toast.success(registerResp?.msg)
                dispatch(updateUserDetails(registerResp))
                localStorage.setItem(USER_TOKEN,registerResp?.token)
                localStorage.setItem("userId",registerResp?.user["_id"])
                navigate("/dashboard")
            }else if(registerResp?.msg){
                toast.error(registerResp?.msg)
            }

            // Reset form data after successful submission if needed
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error while submitting registration form:', error);
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

            <Box>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='firstName' mb="5px">First Name</Typography>
                    <CustomTextField id="firstName" variant="outlined" fullWidth value={formData.firstName} onChange={handleChange} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='lastName' mb="5px">Last Name</Typography>
                    <CustomTextField id="lastName" variant="outlined" fullWidth value={formData.lastName} onChange={handleChange} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">Email Address</Typography>
                    <CustomTextField id="email" variant="outlined" fullWidth value={formData.email} onChange={handleChange} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">Password</Typography>
                    <CustomTextField id="password" variant="outlined" fullWidth value={formData.password} onChange={handleChange} />
                </Stack>
                <Button color="primary" variant="contained" size="large" fullWidth onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                </Button>
            </Box>
            {subtitle}
        </>
    );
};

export default AuthRegister;
