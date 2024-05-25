import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form'
import ListOfSMS from './ListOfSMS';
import { selectCurrentList } from '../../features/auth/authSlice';
import { useSelector } from 'react-redux';
import { usePostListMutation } from '../../features/auth/authApiSlice';
import './Home.css'

function BigForm () {
  const [post] = usePostListMutation()

  const { control, handleSubmit } = useForm({
    defaultValues: {
        yourNumber: '',
        toNumber: '',
        date: '',
        message: '',
        where: ''
    }
  });

  const onSubmit =  async (data) => {
    console.log(data)
    try {
      const { yourNumber, toNumber, date, message, where } = data
      await post({ yourNumber, toNumber, date, message, where }).unwrap()
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className='smsBox'>
      <form className='smsForm' onSubmit={handleSubmit(onSubmit)}>
        <Typography sx={{ fontWeight: 'bold' }} className='txt'>Who would you like to communicate with?</Typography>
        <div className='smsDiv'>
          <Controller
            name='yourNumber'
            control={control}
            render={ ({ field }) => 
              <TextField
                required
                id='standard-helpText'
                label='Your Phone Number'
                variant='standard'
                {...field} 
              />
            }
          />
          <Controller
            name='toNumber'
            control={control}
            render={ ({ field }) => 
              <TextField
                required
                id='standard-helpText'
                label='Recipient Phone Number'
                variant='standard'
                {...field} 
              />
            }
          />
          <Controller
            name='date'
            control={control}
            render={ ({ field }) => 
              <TextField
                required
                id='standard-helpText'
                label='Time and Date'
                variant='standard'
                {...field} 
              />
            }
          />
          <Controller
            name='where'
            control={control}
            render={ ({ field }) => 
              <TextField
                required
                id='standard-helpText'
                label='Where to meet'
                variant='standard'
                {...field} 
              />
            }
          />
          <Controller
            name='message'
            control={control}
            render={ ({ field }) => 
              <TextField
                required
                id='standard-multiline-static'
                label='Message'
                variant='standard'
                multiline
                rows={2}
                {...field} 
              />
            }
          />
          <div><Button variant='contained' style={{ background: 'var(--color-1)' }} type='submit'>Submit</Button></div>
        </div>
      </form>
    </div>
  )
}

//yourNumber ToNumber Time Message Date
const items = [
  {
    yourNumber: '123456798',
    toNumber: '281-330-8004',
    time: '11-11-22',
    message: 'Come Pick Me Up!',
    where: 'Galleria'
  },
  {
    yourNumber: '123456798',
    toNumber: '713-390-5979',
    time: '11-11-22',
    message: 'Come Pick Me Up!',
    where: 'McDonalds'
  },
  {
    yourNumber: '123456798',
    toNumber: '281-777-9311',
    time: '11-11-22',
    message: 'Come Pick Me Up!',
    where: 'University of Houston'
  },
  {
    yourNumber: '123456798',
    toNumber: '713-214-5325',
    time: '11-11-22',
    message: 'Come Pick Me Up!',
    where: 'BigCoffeCafe'
  },
  {
    yourNumber: '123456798',
    toNumber: '792-259-8633',
    time: '11-11-22',
    message: 'Come Pick Me Up!',
    where: 'Football Stadium'
  },
  {
    yourNumber: '123456798',
    toNumber: '979-879-1146',
    time: '11-11-22',
    message: 'Come Pick Me Up!',
    where: 'Your favorite food spot'
  },
  
]

function Home() {
  const list = useSelector(selectCurrentList)
  return (
    <div className='homeContainer'>
      <div className='homeDiv'>
        <BigForm />
        <ListOfSMS items={items}/>
      </div>
    </div>
  )
}

export default Home