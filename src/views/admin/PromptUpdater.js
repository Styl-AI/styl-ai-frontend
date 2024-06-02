import React, { useEffect, useState } from 'react';
import { Grid, Box, Card, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as PromptApi from "../../apis/prompt.api"
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // semi-transparent white background
    zIndex: 2, // place loader above other elements
  },
}));

const PromptUpdater = () => {
  const classes = useStyles();
  const [selectedOption, setSelectedOption] = useState('');
  const [textInput, setTextInput] = useState('');
  const [playgroundOption, setPlayGroundOption] = useState([])
  const [selectedKey,setSelectedKey] = useState('')
  const [promptId, setPromptId] = useState('')
  const [loading,setLoading] = useState(false)
  const { userId } = useSelector(state => state.user);

  useEffect(()=>{
    retirevePrompts()
  },[userId])

  const retirevePrompts=async()=>{
    try {
      setLoading(true)
      if(userId){
        const promptlist = await PromptApi.listPrompts({userId: userId });
        if(promptlist?.status && promptlist?.promptsList){
          const formattedData = convertData(promptlist?.promptsList)
          setPlayGroundOption(formattedData)
          setTextInput(formattedData[0].value)
          setSelectedOption(formattedData[0])
          setPromptId(promptlist?.promptsList[0]?.id)
          setSelectedKey(formattedData[0].key)
        }
      }
      setLoading(false)
    } catch (error) {
      console.log("error while retrieving prompts",error)
      setLoading(false)
    }
  }

  function convertData(data) {
    const result = [];
    data.forEach(prompt => {
      result.push({ label: "Reply to User's Query", value: prompt.reply_to_user_prompt, key :"reply_to_user_prompt" });
      result.push({ label: "Product Research", value: prompt.search_on_topic_prompt , key:"search_on_topic_prompt" });
      result.push({ label: "Extract User Personalization", value: prompt.user_personalization_prompt, key:"user_personalization_prompt" });
    });
    return result;
  }

  const handleOptionChange = (event) => {
    setTextInput(event?.target?.value?.value);
    setSelectedOption(event?.target?.value)
    setSelectedKey(event?.target?.value?.key)
  };

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSaveClick = async() => {
    try {
      setLoading(true)
      const data  = {
        "data":{
          [selectedKey]:textInput
        },
        promptId : promptId,
        userId : userId
      }
      if(data){
        const updatePrompt = await PromptApi.updatePrompts(data)
        if(updatePrompt?.status){
          toast.success("Prompt Updated Successfully !!")
        }
      }
      setLoading(false)
    } catch (error) {
      console.log("error while saving prompt",error)
      setLoading(false)
    }
  };

  return (
    <>
      <Box position="relative">
        {loading && (
          <div className={classes.loaderContainer}>
            <CircularProgress />
          </div>
        )}
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={12} lg={6} xl={6}>
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '900px', height: 'auto' }}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
                <Typography variant='h3' sx={{textAlign:"center", color:"#40A578"}} >Update Prompts</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl className={classes.formControl} fullWidth>
                    <Select
                      labelId="select-label"
                      id="select"
                      value={selectedOption}
                      onChange={handleOptionChange}
                    >
                      {playgroundOption?.length >0 && playgroundOption.map((option) => (
                        <MenuItem key={option.value} value={option}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="text-input"
                    label={textInput == "" ? "Prompt":""}
                    multiline
                    rows={10}
                    variant="outlined"
                    value={textInput}
                    onChange={handleTextChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box mt={2} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={handleSaveClick}>
                  Save
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PromptUpdater;
