import React, { useEffect, useState } from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { useDispatch, useSelector } from 'react-redux';
import * as ConversationApi from '../../../apis/conversation.api'
import { updateConversationDetails } from 'src/store/conversations/conversationSlice';
import AdminMenuItems from './AdminMenuItem';
const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const { userId,userInfo } = useSelector(state => state.user);
  const [conversationList, setConversationList] = useState([])
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch()
  console.log("userInfo",userInfo)
  useEffect(()=>{
    getHistoryList()
  },[userId])

  const getHistoryList=async()=>{
    try {
       setLoader(true)
       if(userId){
        const convResp = await  ConversationApi.listConversationByUserId({userId})
        if(convResp?.status && convResp?.list?.length>0){
          setConversationList(convResp?.list)
        }
       }
       setLoader(false)
      
    } catch (error) {
       console.log("error while getting history list",error);
       setLoader(false)
    }
  }

  const resetChatPanel=()=>{
      const payload = {
        conversationId :"",
        userId : localStorage.getItem("userId")
      }
      dispatch(updateConversationDetails(payload));
      window.location.reload('/dashboard');
  }

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {userInfo?.role =="user" ? Menuitems.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} childrenItems={conversationList} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } 
          else {
            return (
              <NavItem item={item} key={item.id}  onClick={resetChatPanel} />
            );
          }
        }): <>
        {
          AdminMenuItems.map((item) => {
            // {/********SubHeader**********/}
            if (item.subheader) {
              return <NavGroup item={item} key={item.subheader} childrenItems={conversationList} />;
  
              // {/********If Sub Menu**********/}
              /* eslint no-else-return: "off" */
            } 
          })
        }
         </>}
      </List>
    </Box>
  );
};
export default SidebarItems;
