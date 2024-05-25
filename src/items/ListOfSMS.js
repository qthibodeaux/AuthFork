import AccountCircle from '@mui/icons-material/AccountCircle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';

function ListOfSMS ({items}) {
    let content
    if (items.length === 0) {
        content = (
            <div className='listDiv' >
                <Typography sx={{ fontWeight: 'bold' }} className='txt'>Previous Messages</Typography>
                <div style={{ background: 'var(--color-2)', height: '70px',  marginTop: '0.75rem' }}>
                    <Typography sx={{ color: 'var(--color-5)'}}>No messages</Typography>
                </div>
            </div>
        )
    } else {
        content = (
            <div className='listDiv'>
              <Typography sx={{ fontWeight: 'bold' }} className='txt'>Previous Messages</Typography>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'var(--color-2)', marginTop: '0.75rem', maxHeight: 455 }}>
                {items.map((item, key) => {
                    return (
                        <div key={key}>
                            <CustomList list={item}/>
                            <Divider variant="inset" component="li" />
                        </div>
                    )
                })}
              </List>
            </div>
          )
    }

    return content
}

function CustomList ({list}) {
    return (
        <ListItem alignItems='flex-start'>
            <ListItemAvatar>
            <AccountCircle className='txtlt'/>
            </ListItemAvatar>
            <ListItemText
            primary={<Typography type='body2' style={{ color: 'var(--color-5)', fontWeight: 'bold' }}>{list.toNumber}</Typography>}
            secondary={
                <Typography
                    sx={{ display: 'inline' }}
                    component='span'
                    variant='body2'
                    color='var(--color-5)'
                >
                    {list.where}
                </Typography>
            }
            >
            </ListItemText>
        </ListItem>
    )
}

export default ListOfSMS