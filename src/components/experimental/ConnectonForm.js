import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Heading, List, Text, TextInput } from 'grommet';
import { Search } from 'grommet-icons'
import { supabase } from '../supabaseClient'
import AuthConsumer from '../useSession';
import useParentDirector from './useParentDirector'

function ConnectonForm() {
  useParentDirector()
  const { type } = useParams()
  const [value, setValue] = useState('')
  const [showError, setShowError] = useState(false)
  const [profile, setProfile] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  const navigate = useNavigate()
  const { session } = AuthConsumer();

  const goToProfile = () => navigate(`/profile/${session.user.id}`)
  const goToCreate = (createType) => navigate(`/createform/${createType}`)

  const onChange = (event) => {
    if (value === '') setShowError(true)
    else setShowError(false)
    
    setValue(event.target.value)
  }

  const checkValidity = () => {
    if (value === '') return setShowError(true)
  }

  async function namesearch() {
    if (value === '') return setShowError(true) 
    console.log("value", value)
    try {
      let { data, error } = await supabase
        .from('profile')
        .select('*')
        .or(`firstname.ilike.%${value}%,nickname.ilike.%${value}%,lastname.ilike.%${value}%`)
        .neq('branch', 0)
        .order('sunrise', { ascending: true });

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error searching profiles:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleShowMore = () => {
    setShowMore(true)
  }

  const displayProfile = showMore ? profile : profile.slice(0, 5)

  const handleProfileClick = (id) => {
    setSelectedProfileId(id);
  };

  const handleConfirm = async () => {
    try {
      if (type === 'smithparent') {
        const { error } = await supabase
          .from('profile')
          .update({ parent: selectedProfileId })
          .eq('id', session.user.id)
          
        if (error) {
          console.log(error);
        }
      } else {
        const connectionType = await supabase
          .from('connection_type')
          .select('id')
          .eq('connection_name', type)
          .single()

        const { error } = await supabase
          .from('connection')
          .insert({
            profile_1: session.user.id,
            profile_2: selectedProfileId,
            connection_type: connectionType.data.id
          })

        if (error) {
          console.log(error);
        }
      }
      
      goToProfile()
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  const getHeadingText = () => {
    switch(type) {
      case 'smithparent':
        return 'Does your Smith side parent have a profile?';
      case 'parent':
        return 'Does your parent have a profile?';
      case 'spouse':
        return 'Does your spouse have a profile?';
      case 'child':
        return 'Does your child have a profile?';
      default:
        return 'Does the profile exist?';
    }
  }

  return (
    <Box fill pad='small'>
      <Box 
        fill
        round='small'
        alignContent='center'
        pad='medium'
        background='neutral-1'
        justify='between'
      >
        <Box gap='medium'>
          <Heading textAlign='center'>{getHeadingText()}</Heading>
          <Box gap='medium'>
            <TextInput 
              icon={<Search />}
              onChange={onChange}
            />
            <Box style={{ visibility: showError ? 'visible' : 'hidden' }}>
              <Text color='red' weight='bold'>Required</Text>
            </Box>
            <Box direction='row' justify='center' gap='medium'>
              <Box width='small' pad='medium' background='#84543C' round='small'>
                <Button plain disabled={loading}>
                  <Text color='#F7DC92' weight='bold' onClick={() => namesearch()}>Search</Text>
                </Button>
              </Box> 
              <Box width='small' pad='medium' background='#84543C' round='small'>
                <Button plain>
                  <Text color='#F7DC92' weight='bold' onClick={() => goToCreate(type)}>Create Profile</Text>
                </Button>
              </Box>  
            </Box>
            <Box>
              {loading 
                ? (
                  <Text>Loading...</Text>
                ) : (
                  profile.length !== 0 && (
                    <Box
                      pad="medium"
                      round="small"
                      height="medium"
                      overflow="auto"
                    >
                      {profile.length > 0 ? (
                        <>
                          <List data={displayProfile} primaryKey="firstname" secondaryKey="nickname">
                            {(profile) => (
                              <Box
                                direction="row"
                                justify="between"
                                align="center"
                                pad="small"
                                background={selectedProfileId === profile.id ? 'light-3' : 'white'}
                                onClick={() => handleProfileClick(profile.id)}
                                key={profile.id}
                              >
                                <Text>
                                  {profile.firstname} {profile.nickname} {profile.lastname}
                                </Text>
                                {selectedProfileId === profile.id && (
                                  <Button label="Confirm" onClick={handleConfirm} />
                                )}
                              </Box>
                            )}
                          </List>
                          {!showMore && profile.length > 5 && (
                            <Box margin={{ top: 'medium' }} width='small' pad='medium' background='#84543C' round='small' align='center' alignSelf='center'>
                              <Button plain>
                                <Text color='#F7DC92' weight='bold' onClick={() => handleShowMore()}> +{profile.length - 5} more </Text>
                              </Button>
                            </Box>
                          )}
                        </>
                      ) : (
                        <Text>No results found. You can try to create the profile.</Text>
                      )}
                    </Box>
                  )
                )
              }    
            </Box>
          </Box>
        </Box>
        <Box pad='large' onClick={goToProfile}>
          <Text textAlign='center' weight='bold' size='large'>Back</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default ConnectonForm