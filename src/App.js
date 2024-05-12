import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';

import { baselightTheme } from "./theme/DefaultColors";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/user/userAction';
import { updateConversationDetails } from './store/conversations/conversationSlice';

function App() {
  const routing = useRoutes(Router);
  const theme = baselightTheme;
  const dispatch = useDispatch()
  const { userToken, userId,userInfo } = useSelector(state => state.user);

  useEffect(()=>{
     if(userId && userToken){
      console.log("userInfo11",userInfo)
      dispatch(getCurrentUser({userId}))
      dispatch(updateConversationDetails({userId}))
     }
  },[])
  return (
    <ThemeProvider theme={theme}>
    <ToastContainer />
      {/* <CssBaseline /> */}
      {routing}

    </ThemeProvider>
  );
}

export default App;
