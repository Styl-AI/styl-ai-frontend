import PropTypes from 'prop-types';
// mui imports
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, styled } from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import { updateConversationDetails } from 'src/store/conversations/conversationSlice';
import { useDispatch, useSelector } from 'react-redux';
import "./styles.css"
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';


const ADMINITEMS=[
  {id : "admin_users", label :"User's List", path:"/admin-homepage"},
  {id : "admin_prompt_changer", label:"Change Prompt", path:"/prompt-settings"}]
const NavGroup = ({ item, childrenItems }) => {
  const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky {...props} />)(
    ({ theme }) => ({
      ...theme.typography.overline,
      fontWeight: '700',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(0),
      color: theme.palette.text.primary,
      lineHeight: '26px',
      padding: '3px 12px',
    }),
  );
  const { userId, conversationId } = useSelector(state => state.conversation);
  const { userInfo } = useSelector(state => state.user);
  const location = useLocation();
  const navigate  = useNavigate()
  

  const dispatch = useDispatch()

  const updateScheduleId=(conversationId)=>{
      if(conversationId){
        const payload = {
          conversationId : conversationId,
          userId : localStorage.getItem("userId")
        }
        dispatch(updateConversationDetails(payload))
      }
  }
  
  const haveSameConvId=(id)=>{
     return conversationId === id
  }

  const changeAdminTab =(item)=>{
       if(item?.path){
        navigate(item?.path)
       }
  }
  const checkActiveAdminTab=(path)=>{
    console.log(location.pathname , path)
    return location.pathname ==path
  }

  return (
    <>
    {userInfo?.role == "user" ?
    <>
      <ListSubheaderStyle>{item.subheader}</ListSubheaderStyle>
      {item.subheader === 'History' && childrenItems?.length > 0 && (
        <List>
          {childrenItems?.length > 0 &&
            childrenItems.map((item, index) => (
              <ListItem disablePadding key={index} sx={haveSameConvId(item?.["_id"]) ?{
                background: "#40A578",
                borderRadius: "6px",
                marginBottom:"5px",
                '&:hover':{
                   background:"#9DDE8B"
                }
              }:{
                background: "#fafafa",
                borderRadius: "6px",
                marginBottom:"5px",
                '&:hover':{
                   background:"#f8f9fc"
                }
              }}>
                <ListItemButton sx={haveSameConvId(item?.["_id"]) ?{
                background: "#40A578",
                borderRadius: "6px",
                marginBottom:"5px",
                '&:hover':{
                   background:"#9DDE8B"
                }
              }:{
                background: "#fafafa",
                borderRadius: "6px",
                marginBottom:"5px",
                '&:hover':{
                   background:"#f8f9fc"
                }
              }} onClick={() => updateScheduleId(item?.["_id"])}>
                  <ListItemIcon>
                    <SmsIcon sx={haveSameConvId(item?.["_id"]) ? { color:"white", minWidth:0, marginRight:1}:{color:'#40A578',minWidth:0, marginRight:1}} />
                  </ListItemIcon>
                  <ListItemText 
                  primary={item.title} 
                  primaryTypographyProps={haveSameConvId(item?.["_id"]) ?{
                    noWrap: true,
                    style: { 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontSize:'15px',
                      color:"white"
                    }
                  }:{
                    noWrap: true,
                    style: { 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontSize:'15px'
                    }
                  }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      )}
      </>
      :
      <>
        <ListSubheaderStyle>{item.subheader}</ListSubheaderStyle>
        <List>
          {ADMINITEMS?.length > 0 &&
            ADMINITEMS.map((item, index) => (
              <ListItem disablePadding key={index} sx={checkActiveAdminTab(item?.["path"]) ?{
                background: "#40A578",
                borderRadius: "6px",
                marginBottom:"5px",
                '&:hover':{
                   background:"#9DDE8B"
                }
              }:{
                background: "#fafafa",
                borderRadius: "6px",
                marginBottom:"5px",
                '&:hover':{
                   background:"#f8f9fc"
                }
              }}>
                <ListItemButton sx={checkActiveAdminTab(item?.["path"]) ?{
                background: "#40A578",
                borderRadius: "6px",
                marginBottom:"5px",
                '&:hover':{
                   background:"#9DDE8B"
                }
              }:{
                background: "#fafafa",
                borderRadius: "6px",
                marginBottom:"5px",
                '&:hover':{
                   background:"#f8f9fc"
                }
              }} onClick={() => changeAdminTab(item)}>
                  <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={checkActiveAdminTab(item?.["path"]) ?{
                    noWrap: true,
                    style: { 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontSize:'15px',
                      color:"white"
                    }
                  }:{
                    noWrap: true,
                    style: { 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontSize:'15px'
                    }
                  }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </>
    } 
    </>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
