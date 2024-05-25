import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';

function NavBar () {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: 'var(--color-1)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className='txtlt'>
              AppToSMS
            </Typography>
            <IconButton>
              <AccountCircle className='txtlt'/>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    )
  }

  export default NavBar