import { Link } from 'react-router-dom';
import { styled, Typography } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '180px',
  overflow: 'hidden',
  display: 'block',
}));

const Logo = () => {
  return (
    <LinkStyled to="/" sx={{ textDecoration : "none", fontWeight:"bold"}}>
       <Typography variant='h1' sx={{textAlign:"center"}} >Styl-AI</Typography>
    </LinkStyled>
  )
};

export default Logo;
