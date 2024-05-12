import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Tooltip, Fab, Button, styled } from '@mui/material';
import { Stack } from '@mui/system';
import Divider from '@mui/material/Divider';
import { IconBasket } from '@tabler/icons';
import BlankCard from '../../../components/shared/BlankCard';
import UnknownImg from '../../../assets/images/logos/unknown.jpg';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import * as PromptApi from "../../../apis/prompt.api"
import { useDispatch, useSelector } from 'react-redux';
import * as MessagesApi from  "../../../apis/message.api"
import { updateConversationDetails } from 'src/store/conversations/conversationSlice';


const ScrollableBox = styled('div')(({ theme }) => ({
    overflowX: 'auto',
    maxWidth: '97%',
    '&::-webkit-scrollbar': {
      width: '6px',
      height: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f0f0f0',
      borderRadius: '10px',
    },
  }));

const ShoppingCard = ({ productList,setLoading,setChatMessages,setSkeltonLoading,setDisplayMessage,chatMessages }) => {

  const { userId,conversationId } = useSelector(state => state.conversation);
  const dispatch = useDispatch()


    const researchOption=async(title)=>{
        try {
            if(title && conversationId){
               setLoading(true)
               setSkeltonLoading(true)
               try {
                window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
              } catch (error) {
                 console.log("error while scrolling to bottom",error)
              }
               setDisplayMessage(`Research on ${title}`)
                const updatedRes = await PromptApi.productResearch({prompt : title,userId,conversationId});
                if(updatedRes?.status){

                      setChatMessages((prevMessages) => [
                        ...prevMessages,
                        { text: title, isUser: true, productList: [] },
                        {
                          text: updatedRes?.result?.ai_response ?? {},
                          isUser: false,
                          productList: updatedRes?.result?.['google_search_response'] ?? [],
                        },
                      ]);
                      if(updatedRes?.updatedRes?.conversationId){
                        dispatch(updateConversationDetails(updatedRes?.updatedRes));
                      }
                }
                setLoading(false)
               setSkeltonLoading(false)
               setDisplayMessage('')

            }
        } catch (error) {
            setLoading(false)
            setSkeltonLoading(false)
            setDisplayMessage('')
            console.error("error while researching the product",error)
        }
    }


    const dealsOption=async(title)=>{
        try {
            if(title){
               setLoading(true)
               setSkeltonLoading(true)
               try {
                window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
              } catch (error) {
                 console.log("error while scrolling to bottom",error)
              }
               const updatedTitle = `Finding deals on ${title}`
               setDisplayMessage(updatedTitle)

                const updatedRes = await PromptApi.productList({prompt : updatedTitle,conversationId,userId});
                if(updatedRes?.status){

                  setChatMessages((prevMessages) => [
                    ...prevMessages,
                    { text: title, isUser: true, productList: [] },
                    {
                      text: updatedRes?.result?.ai_response ?? {},
                      isUser: false,
                      productList: updatedRes?.result?.['google_search_response'] ?? [],
                    },
                  ]);
                  if(updatedRes?.updatedRes?.conversationId){
                    dispatch(updateConversationDetails(updatedRes?.updatedRes));
                  }
                      
                }
                setLoading(false)
                setSkeltonLoading(false)
               setDisplayMessage('')
            }
        } catch (error) {
            setLoading(false)
            setSkeltonLoading(false)
            setDisplayMessage('')
            console.error("error while researching the product",error)
        }
    }

    const navigateToNextPage = async (product) => {
      try {
        if (product?.link) {
          window.open(product.link, '_blank').focus();
        }
        const messageId  = product?.chatId ?? ""
        const productId = product?.["product_id"] ?? ""
        if( messageId && productId){
          await updateProductCountClick(messageId,productId)
        }
      } catch (error) {
         console.log("error while updating product click count")
      }
    }

    const updateProductCountClick= async(messageId,productId)=>{
      try {
        await MessagesApi.updateMessageCount({messageId :messageId,productId:productId,conversationId:conversationId })  
      } catch (error) {
         console.log("error while updating product count click");
         return false
      }
    }

  return (
    <ScrollableBox>
    <Grid container spacing={3} wrap="nowrap" sx={{marginTop:"1rem"}}>
      {productList?.length > 0 &&
        productList.map((product, index) => (
          <Grid item sm={12} md={4} lg={3} key={index}>
            <Card
              elevation={9}
              sx={{ 
                maxWidth: 400, 
                borderRadius:"1rem", 
                minWidth:250,
                border: "1px solid #e0e0e0",
                transition: 'box-shadow 0.3s', // Adding transition for smooth effect
                '&:hover': {
                    boxShadow: '3px 3px 10px 3px #ADD8E6', // Applying box shadow on hover
                  },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                sx={{ objectFit :"contain", marginTop:"0.6rem"}}
                image={product?.thumbnail ?? UnknownImg}
                alt={product?.title}
                onClick={()=>navigateToNextPage(product)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                {product?.title && (
                  <Typography
                  sx={{ 
                    '&:hover': {
                        color: '#5d87ff', // Applying box shadow on hover
                      },
                  }}
                   gutterBottom variant="h5" component="div" onClick={()=>navigateToNextPage(product)}>
                    {product?.title}
                  </Typography>
                )}
                {product?.rating && (
                  <Box display="flex" alignItems="center" mb={1} onClick={()=>navigateToNextPage(product)}>
                    <Typography sx={{ marginRight: '2px' }}>{product.rating}</Typography>
                    <Rating
                      sx={{ marginRight: '3px' }}
                      readOnly
                      name="read-only"
                      precision={0.5}
                      value={product.rating}
                    />
                    {product?.reviews && (
                      <Typography component="legend">{`${product.reviews}`}</Typography>
                    )}
                  </Box>
                )}
                <hr />
                {product?.extracted_price && (
                  <Typography gutterBottom variant="h4" component="div" onClick={()=>navigateToNextPage(product)}>
                    <sup>$</sup>
                    {`${product.extracted_price}`}
                  </Typography>
                )}
                {product?.delivery && (
                  <Typography
                  onClick={()=>navigateToNextPage(product)}
                    sx={{ fontSize: '12px', color: '#515151',
                    '&:hover': {
                        color: '#000000',
                      } }}
                    component="legend"
                  >{`${product.delivery}`}</Typography>
                )}
              <Stack direction="row" spacing={2} mt={2} sx={{ flexGrow: 1, justifyContent: 'space-between',}}>
              <Button variant="outlined" sx={{ flex: 1 }} onClick={()=> researchOption(product.title)}>Research</Button>
              <Button variant="outlined" sx={{ flex: 1 }} onClick={()=> dealsOption(product.title)}>Deals</Button>
              </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
    </ScrollableBox>
  );
};

export default React.memo(ShoppingCard);
