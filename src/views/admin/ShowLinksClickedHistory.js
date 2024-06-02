import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Tooltip, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import the icon
import * as ConversationApi from "../../apis/conversation.api"
import { formatConversation, processConversation } from 'src/utils/conversation.utils';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close'; 

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

export default function ShowLinksClickedHistory({linksClickedModal, setLinksClickedModal, conversationList}) {

  const [chatMessages, setChatMessages] = React.useState([]);
  const [expandedAccordion, setExpandedAccordion] = React.useState("");
  const [totalLinksCount,setTotalLinkscount] = React.useState(0);
  const [loading, setLoading] = React.useState(false); // State to track loading

  const handleClose = () => setLinksClickedModal(false);

  React.useEffect(()=>{
     if(conversationList?.length >0){
      const totalCount = sumConversationCount(conversationList)
      setTotalLinkscount(totalCount)
     }
  },[conversationList])

  function sumConversationCount(conversations) {
    try {
      let sum = 0;
      conversations.forEach((conversation) => {
        sum += conversation.conversationCount;
      });
      return sum;
    } catch (error) {
       return 0
    }
  }

  const extractConversation = async (conversation) => {
    try {
      if(conversation?.id != expandedAccordion || expandedAccordion ==""){
        if(conversation?.userId && conversation?.id) {
          setLoading(true); // Set loading to true
          setChatMessages([]);
          const convResp = await ConversationApi.listClickedLinksById({conversationId : conversation?.id,userId : conversation?.userId});
          if(convResp?.status) {
            setChatMessages(convResp?.clickedLinks);
            setExpandedAccordion(conversation?.id);
          }
        }
      }
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.log("error while extracting conversation",error)
      setLoading(false); // Set loading to false in case of error
    }
  }

  function formatDate(dateString) {
    // Parse the input date string using Moment.js
    let date = moment(dateString);
  
    let formattedDate = date.format('DD MMM, YYYY');
    
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
        open={linksClickedModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display="flex" justifyContent="center" mt={2}>
            <Box display="flex" alignItems="center" mr={1}>
              <Typography variant="h4" mb={2}>
                Links clicked
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" ml={1}>
              <Typography variant="h4" mb={2}>
                {totalLinksCount > 0 && (
                  <Chip label={`${totalLinksCount}`} color="primary" />
                )}
              </Typography>
            </Box>
            <IconButton
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={handleClose} // Assuming handleClose closes the modal
            >
              <CloseIcon />
            </IconButton>
          </Box>

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
                  {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      {expandedAccordion === item.id && <ChatLinksList chatMessages={chatMessages} />}
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </Modal>
    </div>
  );
}

const ChatLinksList = ({ chatMessages }) => {
  return (
    <>
      {chatMessages?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize:16, fontWeight:800}}>Clicked Count</TableCell>
                <TableCell sx={{ fontSize:16, fontWeight:800}}>Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chatMessages.map(row => (
                <TableRow key={row._id}>
                  <TableCell>
                    <Chip
                      label={`${row?.clickCount ?? 0}`}
                      sx={{
                        background: '#9DDE8B',
                        color: 'white',
                        height: '28px',
                        fontWeight: '800',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                  <Tooltip title={row.title ?? ""} placement="right-end">
                    <a href={row.link} target="_blank" rel="noopener noreferrer">
                      {row.link}
                    </a>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableRow>
          <TableCell align="center" colSpan={2}>
            <Typography>No Data Available !!</Typography>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
