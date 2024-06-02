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
import { Scrollbars } from 'react-custom-scrollbars';
import PageContainer from 'src/components/container/PageContainer';
// import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import userAvatar from '../../assets/images/others/profile-user.png';
import aiAvatar from '../../assets/images/others/sparkler.png';
import * as PromptApi from '../../apis/prompt.api';
// components
import IntroductionPage from './components/IntroductionPage';
import ShoppingCard from './components/ShoppingCard';
import Skeleton from '@mui/material/Skeleton';

import * as ConversationApi from "../../apis/conversation.api"
import { useDispatch, useSelector } from 'react-redux';
import { processConversation } from 'src/utils/conversation.utils';
import "./styles.css"
import { toast } from 'react-toastify';
import { updateConversationDetails } from 'src/store/conversations/conversationSlice';
const Dashboard = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skeltonLoading, setSkeltonLoading] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('');

  const { userId,conversationId } = useSelector(state => state.conversation);
  const dispatch  = useDispatch()
  useEffect(()=>{
    getCurrentData();
  },[conversationId])


  const getCurrentData= async()=>{
    try {
      setSkeltonLoading(true)
      setLoading(true)
      if(userId && conversationId){
        setChatMessages([])
        const convResp = await ConversationApi.listConversationById({conversationId,userId});
        if(convResp?.status){
            const organizedConv = processConversation(convResp);
            setChatMessages(organizedConv)
            toast.success(convResp?.msg)
        }else{
          toast.error(convResp?.msg)
        }
      }
      if(conversationId == ""){
        setChatMessages([])
      }
      setSkeltonLoading(false)
      setLoading(false)
      
    } catch (error) {
      console.log("error while getting current conversation data",error)
      toast.error("Something went wrong !! Please try again.")
      setSkeltonLoading(false)
      setLoading(false)
    }
  }

  const handleSendMessage = async (message) => {
    try {
      if (message.trim() !== '') {

        if(chatMessages?.length  ==0){
          resetIterSteps()
        }
        setDisplayMessage(message);
        setSkeltonLoading(true);
        setLoading(true);
        let aiResponse = false;
        const iterStep = returnIterationCount();
        if (iterStep >= 2) {
          // const resultantArr = getUserTexts(chatMessages);
          aiResponse = await PromptApi.productList({ prompt: message,conversationId,userId });
          resetIterSteps();
        } else {
          const id = userId ? userId : localStorage.getItem("userId")
          aiResponse = await PromptApi.aiPomptGenerator({ prompt: message,userId:id,conversationId });
        }
        if (aiResponse?.status) {
          setLocalStorageItem();
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { text: message, isUser: true, productList: [] },
            {
              text: aiResponse?.result?.ai_response ?? {},
              isUser: false,
              productList: aiResponse?.result?.['google_search_response'] ?? [],
            },
          ]);
          if(aiResponse?.updatedRes?.conversationId){
            dispatch(updateConversationDetails(aiResponse?.updatedRes));
          }
          setLoading(false);
          setDisplayMessage("")
          setSkeltonLoading(false);
        }
      }
    } catch (error) {
      console.log("error while showing lists",error)
      setSkeltonLoading(false);
    }
  };

  function getUserTexts(data) {
    return data.filter((item) => item.isUser).map((item) => item);
  }

  const resetIterSteps = () => {
    try {
      localStorage.removeItem('chatIter');
      return;
    } catch (error) {
      console.log('error while resetting iter step');
      return;
    }
  };
  const returnIterationCount = () => {
    try {
      let chatIter = localStorage.getItem('chatIter');
      if (chatIter) {
        return chatIter;
      }
      return 0;
    } catch (error) {
      console.log('error while getting iteration count', error);
    }
  };

  const setLocalStorageItem = () => {
    try {
      let chatIter = localStorage.getItem('chatIter');

      if (chatIter) {
        localStorage.setItem('chatIter', parseInt(chatIter) + 1);
      } else {
        localStorage.setItem('chatIter', 1);
      }
    } catch (error) {
      console.error('Error while setting localStorage item:', error);
    }
  };
  const handleBadgeClick = (badge) => {
    setSkeltonLoading(true);
    handleSendMessage(badge);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      setSkeltonLoading(true);
      handleSendMessage(event.target.value);
      event.target.value = ''; // Clear input field after sending message
    }
  };

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box style={{ flex: 1 }}>
          {chatMessages?.length > 0 ? (
            // <Scrollbars autoHide style={{ flex: 1 }}>
            <Grid container spacing={3}>
              {/* Display chat messages */}
              {chatMessages.map((message, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 1,
                      width: '100%',
                    }}
                  >
                    {message.isUser ? (
                      <>
                        <Avatar
                          src={userAvatar}
                          alt="User Avatar"
                          sx={{ width: 32, height: 32, marginRight: 1 }}
                        />
                        <Box
                          sx={{
                            backgroundColor: '#7598ff',
                            borderRadius: '0.7rem 0.7rem 0.7rem 1px',
                            padding: '1rem',
                            width: '94%',
                            fontSize: '1.1rem',
                            color: 'white',
                            fontWeight: 700,
                          }}
                        >
                          {message.text}
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                          <Avatar
                            src={aiAvatar}
                            alt="AI Avatar"
                            sx={{ width: 32, height: 32, marginRight: 1 }}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              width: '100%',
                            }}
                          >
                            <Box
                              sx={{
                                backgroundColor: '#E5E5E5',
                                borderRadius: '0.7rem 0.7rem 0.7rem 1px',
                                padding: '1rem',
                                width: '97%',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                marginBottom: '1rem', // Add margin bottom for spacing between boxes
                              }}
                            >
                              {/* Content */}
                              <Typography
                                variant="h5"
                                component="div"
                                style={{ fontWeight: 'bold' }}
                              >
                                {message?.text?.ai_reply ?? ''}
                              </Typography>

                              {/* Keywords as badges */}
                              {message?.text?.keywords?.length > 0 &&
                                message?.text?.keywords.map((keyword, index) => (
                                  <Chip
                                    key={index}
                                    label={keyword}
                                    variant="outlined"
                                    sx={{
                                      padding: '1rem',
                                      fontWeight: 700,
                                      border: '2px solid #64C7FF',
                                      background: 'white',
                                      fontSize: '1rem',
                                      margin: '7px',
                                      cursor: 'pointer', // Make the badge clickable
                                    }}
                                    onClick={() => handleBadgeClick(keyword)} // Call handleSendMessage with badge text
                                  />
                                ))}
                            </Box>

                            <Box
                              sx={{
                                width: '100%',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                              }}
                            >
                              {/* Suggestions as badges */}
                              {message?.text?.suggestions?.length > 0 &&
                                message?.text?.suggestions.map((suggestion, index) => (
                                  <Chip
                                    key={index}
                                    label={suggestion}
                                    variant="outlined"
                                    sx={{
                                      fontWeight: 700,
                                      border: '2px solid #64C7FF',
                                      background: 'white',
                                      fontSize: '1rem',
                                      margin: '7px',
                                      cursor: 'pointer', // Make the badge clickable
                                    }}
                                    onClick={() => handleBadgeClick(suggestion)} // Call handleSendMessage with badge text
                                  />
                                ))}
                            </Box>
                            <Box
                              sx={{
                                width: '100%',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                              }}
                            >
                              {message?.productList?.length > 0 && (
                                <ShoppingCard
                                  productList={message?.productList}
                                  setLoading={setLoading}
                                  chatMessages={chatMessages}
                                  setChatMessages={setChatMessages}
                                  setSkeltonLoading={setSkeltonLoading}
                                  setDisplayMessage={setDisplayMessage}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
              ))}
              {skeltonLoading ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                    <Avatar
                      src={userAvatar}
                      alt="User Avatar"
                      sx={{ width: 32, height: 32, marginRight: 1 }}
                    />

                    <Box
                      sx={{
                        backgroundColor: '#7598ff',
                        borderRadius: '0.7rem 0.7rem 0.7rem 1px',
                        padding: '1rem',
                        width: '100%',
                        fontSize: '1.1rem',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    >
                      {displayMessage}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      width: '100%',
                      marginTop: '3%',
                    }}
                  >
                    <Box>
                      <Avatar
                        src={aiAvatar}
                        alt="AI Avatar"
                        sx={{ width: 32, height: 32, marginRight: 1 }}
                      />
                    </Box>

                    <Box sx={{ width: '100%' }}>
                      <Skeleton />
                      <Skeleton animation="wave" />
                      <Skeleton animation={false} />
                    </Box>
                  </Box>
                </>
              ) : (
                <></>
              )}
            </Grid>
          ) : (
            // </Scrollbars>
            skeltonLoading ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <Avatar
                    src={userAvatar}
                    alt="User Avatar"
                    sx={{ width: 32, height: 32, marginRight: 1 }}
                  />

                  <Box
                    sx={{
                      backgroundColor: '#7598ff',
                      borderRadius: '0.7rem 0.7rem 0.7rem 1px',
                      padding: '1rem',
                      width: '100%',
                      fontSize: '1.1rem',
                      color: 'white',
                      fontWeight: 700,
                    }}
                  >
                    {displayMessage}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    width: '100%',
                    marginTop: '3%',
                  }}
                >
                  <Box>
                    <Avatar
                      src={aiAvatar}
                      alt="AI Avatar"
                      sx={{ width: 32, height: 32, marginRight: 1 }}
                    />
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                  </Box>
                </Box>
              </>
            ) : (
              <Grid container spacing={3}>
              <Grid item xs={12}>
                <IntroductionPage />
              </Grid>
            </Grid>
            )
            
          )}
        </Box>
        <Box p={2} sx={{ position: 'sticky', bottom: 0, backgroundColor: 'white',borderRadius:"2rem" ,
           '& .MuiOutlinedInput-root': {
            borderRadius: '2rem', 
          },
         }}>
          <TextField
            placeholder="Ask me anything..."
            fullWidth
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress color="primary" size={24} />
                  ) : (
                    <SendIcon
                      color="primary"
                      onClick={() =>
                        handleSendMessage(document.querySelector('#messageInput').value)
                      }
                    />
                  )}
                </InputAdornment>
              ),
            }}
            sx={{ border: '2px solid #64c7ff', borderRadius:"2rem" }}
            disabled={loading}
            id="messageInput"
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
