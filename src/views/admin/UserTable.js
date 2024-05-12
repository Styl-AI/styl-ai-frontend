import React, { useState, useEffect } from 'react';
import {
  Typography, Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import DashboardCard from '../../components/shared/DashboardCard';
import * as UserApi from "../../apis/user.api"
import ShowPersonalizedInfoModal from './ShowPersonalizedInfo';
import { toast } from 'react-toastify';
import * as ConversationApi from "../../apis/conversation.api"
import ShowChatHistory from './ShowChatHistory';
import FullScreenLoader from './FullScreenLoader'; 
import ShowLinksClickedHistory from './ShowLinksClickedHistory';

const UserTable = () => {
  const [userData, setUserData] = useState([]);
  const [showPersonalizedInfo, setShowPersonalizedInfo] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [userClicked, setUserClicked] = useState({});
  const [conversationList, setConversationList] = useState([]);
  const [loadingChatHistory, setLoadingChatHistory] = useState(false);
  const [linksClickedModal, setLinksClickedModal] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true); // Add loading state for users

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const fetchDataFromApi = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await UserApi.usersList({ userId });
        if (response?.status) {
          setUserData(response?.usersList);
          setLoadingUsers(false); // Set loading state to false when users are fetched
        }
      }
      setLoadingUsers(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoadingUsers(false);
    }
  };

  const viewPersonalizedInfo = (userInfo) => {
    if (userInfo && userInfo?.["user_personalized_data"]?.length > 0) {
      setUserClicked(userInfo);
      setShowPersonalizedInfo(true);
    } else {
      toast.error("No Personalized Information Available !!");
    }
  };

  const chatHistory = async (userInfo) => {
    try {
      if (userInfo?.["_id"]) {
        setLoadingChatHistory(true);
        const convResp = await ConversationApi.listConversationByUserId({ userId: userInfo["_id"] });
        
        if (convResp?.status && convResp?.list?.length > 0) {
          setConversationList(convResp?.list);
          setShowChatHistory(true)
        }else{
          toast.error("No Chat History  Available !!");
        }
      }else{
        toast.error("No Chat History  Available !!");
      }
    } catch (error) {
      console.log("error while loading chat history");
    } finally {
      setLoadingChatHistory(false);
    }
  };


  const linksClicked = async (userInfo) => {
    try {
      if (userInfo?.["_id"]) {
        setLoadingChatHistory(true);
        const convResp = await ConversationApi.listConversationByUserId({ userId: userInfo["_id"] });
        
        if (convResp?.status && convResp?.list?.length > 0) {
          setConversationList(convResp?.list);
          setLinksClickedModal(true)
        }else{
          toast.error("No Links Clicked  Available !!");
        }
      }else{
        toast.error("No Links Clicked  Available !!");
      }
    } catch (error) {
      console.log("error while loading chat history");
    } finally {
      setLoadingChatHistory(false);
    }
  };
  return (
    <>
     
      {loadingChatHistory && <FullScreenLoader />} {/* Conditionally render FullScreenLoader for chat history */}
      {showPersonalizedInfo && userClicked && <ShowPersonalizedInfoModal setShowPersonalizedInfo={setShowPersonalizedInfo} showPersonalizedInfo={showPersonalizedInfo} userClicked={userClicked} />}
      {linksClickedModal && <ShowLinksClickedHistory linksClickedModal={linksClickedModal} setLinksClickedModal={setLinksClickedModal} conversationList={conversationList} />}
      {showChatHistory && <ShowChatHistory showChatHistory={showChatHistory} setShowChatHistory={setShowChatHistory} conversationList={conversationList} />}
      <DashboardCard title="User Table">
        <Box sx={{ overflowX: 'auto' }}>
        {loadingUsers && <FullScreenLoader />} {/* Conditionally render FullScreenLoader */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    UserId
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Personalized Information
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Sessions
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                     Links clicked
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Typography>{user.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user?.firstName + "  " + user?.lastName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{user.email}</Typography>
                  </TableCell>
                  <TableCell onClick={() => viewPersonalizedInfo(user)}>
                    <Chip label={"View"} color="primary" />
                  </TableCell>
                  <TableCell onClick={() => chatHistory(user)}>
                    <Chip label={"View"} sx={{ background: "#64C7FF", color: 'white' }} />
                  </TableCell>
                  <TableCell onClick={() => linksClicked(user)}>
                    <Chip label={"View"} sx={{ background: "#0D6EFD", color: 'white' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DashboardCard>
    </>
  );
};

export default UserTable;
