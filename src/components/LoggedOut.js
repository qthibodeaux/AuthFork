import { useEffect, useState } from 'react';
import { Box, Card, Grid, Heading, ResponsiveContext, Text } from 'grommet'
import { useContext } from 'react'
import supabaseClient from '../supabaseClient';

const cards = Array(20)
  .fill()
  .map((_, i) => <Text key={i}>{`Card ${i}`}</Text>);

function LoggedOut() {
    const size = useContext(ResponsiveContext)
    const [data, setData] = useState(null)

    useEffect(() => {
      const fetchData = async () => {
        try {
          const { data: postData, error: postError } = await supabaseClient
            .from('thre')
            .select(`
              thread_title,
              up ( name ),
              categories ( name )
            `)
            .limit(12)

          if (postError) {
            console.error('Error from supabase')
            return;
          }

          setData(postData)
        } catch (error) {
          console.error('Error', error.message)
        }
      }

    fetchData()
    }, [])

    const truncateString = (str, maxLength) => {
      if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...';
      }
      return str;
    };

  return (
    <Box
        border
      >
        <Box
          align="center"
          alignSelf="center"
          justify="center"
          width='xlarge'
        >
          Not Logged In
          <Box
            height='xsmall'
            width='100%'
            style={{ background: "linear-gradient(to bottom right, #342628, #FEAA00 90%)" }}
          >
            <Box border justify="center" flex pad='medium'>
              <Heading color='white' >
                Beyhive
              </Heading>
            </Box>
          </Box>
          <Heading>
            Join The Conversation
          </Heading>
          <Heading>
            Todo: add anchor tags to click categories, pics, and titles
          </Heading>
          
        </Box>
        <Box
            width='xlarge'
            alignSelf='center'
        >
            <Grid
                columns={size !== 'small' ? 'small' : '100%'}
                gap="medium"
                pad={
                    size !== 'small' 
                    ? (
                        {
                            horizontal: 'small'
                        }
                    ) 
                    : (
                        {
                            horizontal: 'large'
                        }
                    )}
            >
                {data
                  ? data.map((item, index) => (
                
                    <Card
                      key={index}
                      pad="small"
                      gap='small'
                      justify='between'
                    >
                        <Heading
                          level='5'
                        >{truncateString(item.thread_title, 50)}</Heading>
                        <Box>
                          <Text
                            weight='bold'
                          >{item.categories.name}</Text>
                          <Text
                            size='small'
                          >{item.up.name}</Text>
                        </Box>
                    </Card>
                    ))
                  : <Text>Loading</Text>
                }
            </Grid>
        </Box>
      </Box>
  )
}

export default LoggedOut