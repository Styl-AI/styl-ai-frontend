import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Grid, Avatar, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import the icon
import * as ConversationApi from "../../apis/conversation.api"
import { formatConversation, processConversation } from 'src/utils/conversation.utils';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import userAvatar from '../../assets/images/others/profile-user.png';
import aiAvatar from '../../assets/images/others/sparkler.png';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "65rem",
  bgcolor: 'background.paper',
  border: '2px solid #e6e1e1',
  boxShadow: 24,
  p: 4,
  maxHeight:"40rem",
  overflowY:"scroll"
};

export default function ShowChatHistory({showChatHistory, setShowChatHistory, conversationList}) {

  const [chatMessages, setChatMessages] = React.useState([]);
  const [expandedAccordion, setExpandedAccordion] = React.useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const handleClose = () => setShowChatHistory(false);

  const extractConversation = async (conversation) => {
    try {
      setLoading(true); // Set loading to true when extracting conversation
      if(conversation?.id != expandedAccordion || expandedAccordion == ""){
        if(conversation?.userId && conversation?.id) {
          setChatMessages([]);
          console.log("{conversationId : conversation?.id,userId : conversation?.userId}",{conversationId : conversation?.id,userId : conversation?.userId})
          const convResp = await ConversationApi.listConversationById({conversationId : conversation?.id,userId : conversation?.userId});
          if(convResp?.status) {
            const organizedConv = formatConversation(convResp);
            setChatMessages(organizedConv);
            setExpandedAccordion(conversation.id);
          }
        }
      }
    } catch (error) {
      console.log("error while extracting conversation",error)
    } finally {
      setLoading(false); // Set loading to false after conversation extraction is done
    }
  }

  function formatDate(dateString) {
    console.log("dateString",dateString)
    // Parse the input date string using Moment.js
    let date = moment(dateString);
  
    let formattedDate = date.format('DD MMM, YYYY, HH:mm:ss');
    
    return formattedDate
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : "");
    if (isExpanded && expandedAccordion === panel) {
      setExpandedAccordion("");
    }
  };

  return (
    <div>
      <Modal
        open={showChatHistory}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            style={{ position: 'absolute', top: 0, right: 0 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" mb={2}>
            Sessions
          </Typography>
          {conversationList?.length > 0 &&
            conversationList.map((item) => (
              <Accordion
                key={item.id}
                expanded={expandedAccordion === item.id}
                onChange={handleAccordionChange(item.id)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  onClick={() => extractConversation(item)}
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                >
                  <Typography variant='h6' style={{ color: '#9DDE8B', marginRight: '8px' }}>
                    {formatDate(item?.createdAt)}
                  </Typography>
                  <Typography  variant='h6' >{item.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {loading ? ( // Render loader when loading is true
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    expandedAccordion === item.id && <DummyTable chatMessages={chatMessages} />
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </Modal>
    </div>
  );
}

const DummyTable = ({ chatMessages }) => {
  return (
    <Box sx={{ maxHeight: '40vh', display: 'flex', flexDirection: 'column' , overflowY:"scroll"}}>
      {chatMessages?.length > 0 && (
        <Grid container spacing={3}>
          {/* Display chat messages */}
          {chatMessages.map((row, index) => (
            <Grid item xs={12} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 1,
                  width: '100%',
                }}
              >
                {/* Check if user reply */}
                <>
                  <Avatar
                    src={userAvatar}
                    alt="User Avatar"
                    sx={{ width: 32, height: 32, marginRight: 1 }}
                  />
                  <Box
                    sx={{
                      backgroundColor: '#9DDE8B',
                      borderRadius: '0.7rem 0.7rem 0.7rem 1px',
                      padding: '0.5rem',
                      width: '90%',
                      fontSize: '1rem',
                      color: 'white',
                      fontWeight: 700,
                    }}
                  >
                    {row.user_reply}
                  </Box>
                </>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 1,
                  width: '100%',
                }}
              >
                <>
                  {/* AI Reply */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                    <Avatar
                      src={aiAvatar}
                      alt="AI Avatar"
                      sx={{ width: 32, height: 32, marginRight: 1 }}
                    />
                    <Box
                      sx={{
                        backgroundColor: '#E5E5E5',
                        borderRadius: '0.7rem 0.7rem 0.7rem 1px',
                        padding: '0.5rem',
                        width: '90%',
                        fontSize: '1rem',
                        marginBottom: '0.4rem',
                      }}
                    >
                      {row.ai_response}
                    </Box>
                  </Box>
                </>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
