import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import React from 'react';


const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const { userId, userToken,userInfo } = useSelector((state) => state.user);

    const { pathname, search } = window.location;
     // If normal user tries to access admin url then redirect it to '/'
     if ((location.pathname === '/admin-homepage' || location.pathname === '/prompt-settings') && userInfo?.role !="admin") {
         return <Navigate to="/" />;
     }
    
     // If admin tries to access user's url then redirect it to '/'
     if(location.pathname === '/dashboard' && userInfo?.role !="user"){
        return <Navigate to="/" />; 
     }

     

    let toPath = `/${location.search}`;
    return (userToken && userId) ? children : <Navigate to={toPath} state={{ from: { pathname, search } }} />
};

export default PrivateRoute;

