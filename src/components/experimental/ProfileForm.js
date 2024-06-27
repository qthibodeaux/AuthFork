import { useEffect, useState } from 'react'
import { Box, Button, Card, DateInput, Grid, Heading, List, Text, TextInput } from 'grommet'
import { Search } from 'grommet-icons'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../useSession'

function ProfileForm () {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [nickName, setNickName] = useState("")
    const [parent, setParent] = useState("")
    const [sunrise, setSunrise] = useState("")
    
    const [activeTab, setActiveTab] = useState("NameForm")

    const MainPage = ({ activeTab }) => {
        let comp = <h1 style={{backgroundColor: 'red', padding: '20px', fontWeight: 600, color: '#fff'}}>Developer Error: invalid tabId!</h1>
        if (activeTab === 'AncestorForm') comp = <AncestorForm setActiveTab={setActiveTab}/>
        else if (activeTab === 'NameForm') comp = <NameForm setActiveTab={setActiveTab} setFirstName={setFirstName} setNickName={setNickName} />
        else if (activeTab === 'FirstNameForm') comp = <FirstNameForm setNickName={setNickName} setActiveTab={setActiveTab} setFirstName={setFirstName} />
        else if (activeTab === 'LastNameForm') comp = <LastNameForm setLastName={setLastName} setActiveTab={setActiveTab} setFirstName={setFirstName} setNickName={setNickName} />
        else if (activeTab === 'NickNameForm') comp = <NickNameForm setActiveTab={setActiveTab} setFirstName={setFirstName} setNickName={setNickName} />
        else if (activeTab === 'ParentForm') comp = <ParentForm setParent={setParent}/>
        else if (activeTab === 'SunriseForm') comp = <SunriseForm  setActiveTab={setActiveTab} setSunrise={setSunrise} setLastName={setLastName} />
        else if (activeTab === 'ConfirmCard') comp = <ConfirmCard  setActiveTab={setActiveTab} firstName={firstName} nickName={nickName} lastName={lastName} sunrise={sunrise} />
        
        
        return (
            <Box
                fill
                pad='small'
            >{comp}</Box>
        )
    }

  return (
    <Box
        fill
        gap='small'
    >
        <FormInfoBox firstName={firstName} nickName={nickName} lastName={lastName} parent={parent} sunrise={sunrise} />
        <MainPage activeTab={activeTab} /> 
    </Box>
  )
}

const FormInfoBox = ({ firstName, lastName, nickName, sunrise}) => {
    function formatDate(dateString) {
        const date = new Date(dateString);
      
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      
        const month = monthNames[date.getMonth()]; 
        const day = date.getDate();
        const year = date.getFullYear();
      
        return `${month} ${day}, ${year}`;
      }

      let formattedDate = formatDate(sunrise)
    return (
        <Box
            fill='horizontal'
            pad='small'
            style={{ visibility: firstName || nickName ? 'visible' : 'hidden'}}
        >
            <Box
                fill='horizontal'
                background='brand'
                round='small'
                pad='medium'
            >
                <Box direction='column' gap='medium'>
                    <Box direction='row' align='center' justify='center' gap='medium'>
                        <Heading level='3'>{firstName}</Heading>
                        {nickName && <Heading level='3'>{nickName}</Heading>}
                        <Heading level='3'>{lastName}</Heading>
                    </Box>
                    {sunrise && (
                        <Box direction='row' align='center' justify='center' gap='medium' >
                            <Heading level='3'>Sunrise: </Heading>
                            <Heading level='3'>{formattedDate}</Heading>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

const AncestorForm = ({ setMainAncestor, setActiveTab }) => {
    const [profiles, setProfiles] = useState([]);
    const [names, setNames] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profile')
                    .select('id, firstname')
                    .eq('branch', 1);

                if (error) {
                throw error;
                }

                setProfiles(data)
                const firstnameArray = data.map(profile => profile.firstname)
                setNames(firstnameArray)
            } catch (error) {
                setError(error.message);
              } finally {
                setLoading(false);
              }
        }

        fetchProfiles();
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const clicky = () => {
        console.log(profiles)
    }
        
    return (
        <Box
            fill
            round='small'
            alignContent='center'
            pad='medium'
            background='neutral-1'
            gap='medium'
        >
            <Button onClick={() => clicky()} label='getData'/>
            <Heading textAlign='center'>Who is your first branch ancestor?</Heading>
            <Grid
                columns='xsmall'
                gap='small'
            >
                {names.map((name, index) => {
                    return (
                        <Card
                            background='black'
                            pad='large'
                            key={index}
                            onClick={() => {
                                setMainAncestor(name)
                                setActiveTab('NameForm')
                            }}
                        >
                            {names[index]}
                        </Card>)
                    }
                )}
                
            </Grid>
        </Box>
    )
}

const NameForm = ({ setMainAncestor, setActiveTab, setFirstName, setNickName } ) => {
    const [value, setValue] = useState('')
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()

    const onChange = (event) => {
        if (value === '') setShowError(true) 
        else setShowError(false)
        setValue(event.target.value)
    }

    const checkValidFirstName = () => {
        if (value === '') return setShowError(true) 
        setActiveTab('NickNameForm')
        setFirstName(value)
    }

    const checkValidNickName = () => {
        if (value === '') return setShowError(true)
        setActiveTab('FirstNameForm')
        setNickName(value)
    }

    const goToHome = () => {
        navigate('/')
    }

    return (
        <Box
            fill
            round='small'
            alignContent='center'
            pad='medium'
            background='neutral-1'
            justify='between'
        >
            <Box
                gap='medium'
            >
                <Heading textAlign='center'>What do we call you?</Heading>
                <Box
                    gap='medium'
                >
                    <TextInput onChange={onChange}/>
                    <Box style={{ visibility: showError ? 'visible' : 'hidden' }}><Text color='red' weight='bold'>Required</Text></Box>
                    <Box
                        direction='row'
                        justify='center'
                        gap='medium'
                    >
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => checkValidFirstName()}
                        >
                            <Text
                                weight='bold'
                                size='large'
                            >
                                First name?
                            </Text>
                        </Box> 
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => checkValidNickName()}
                        >
                            <Text
                                weight='bold'
                                size='large'
                            >
                                Nickname?
                            </Text>
                        </Box> 
                    </Box>
                </Box>
                
            </Box>
            <Box
                pad='large'
                onClick={() => goToHome()}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

const FirstNameForm = ({ setNickName, setActiveTab, setFirstName }) => {
    const [value, setValue] = useState('')
    const [showError, setShowError] = useState(false)

    const onChange = (event) => {
        if (value === '') setShowError(true)
        else setShowError(false)
        setValue(event.target.value)
    }

    const checkValidFirstName = () => {
        if (value === '') return setShowError(true)
        setActiveTab('LastNameForm')
        setFirstName(value)
    }

    return (
        <Box
            fill
            round='small'
            alignContent='center'
            pad='medium'
            background='neutral-1'
            justify='between'
        >
            <Box
                gap='medium'
            >
                <Heading textAlign='center'>What is your first name?</Heading>
                <Box
                    gap='medium'
                >
                    <TextInput onChange={onChange}/>
                    <Box style={{ visibility: showError ? 'visible' : 'hidden' }}><Text color='red' weight='bold'>Required</Text></Box>
                    <Box
                        direction='row'
                        justify='center'
                        gap='medium'
                    >
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => checkValidFirstName()}
                        >
                            <Text
                                weight='bold'
                                size='large'
                            >
                                Submit
                            </Text>
                        </Box> 
                    </Box>
                </Box>
            </Box>
            <Box
                pad='large'
                onClick={() => {
                    setNickName('')
                    setActiveTab('NameForm')
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

const NickNameForm = ({ setNickName, setActiveTab, setFirstName }) => {
    const [value, setValue] = useState('')
    const [showError, setShowError] = useState(false)

    const onChange = (event) => {
        if (value === '') setShowError(true)
        else setShowError(false)
        setValue(event.target.value)
    }

    const noNickName = () => {
        setActiveTab('LastNameForm')
    }

    const checkValidNickName = () => {
        if (value === '') return setShowError(true)
        setActiveTab('LastNameForm')
        setNickName(value)
    }

    return (
        <Box
            fill
            round='small'
            alignContent='center'
            pad='medium'
            background='neutral-1'
            justify='between'
        >
            <Box
                gap='medium'
            >
                <Heading textAlign='center'>Do you have a nickname?</Heading>
                <Box
                    gap='medium'
                >
                    <TextInput onChange={onChange}/>
                    <Box style={{ visibility: showError ? 'visible' : 'hidden' }}><Text color='red' weight='bold'>Required</Text></Box>
                    <Box
                        direction='row'
                        justify='center'
                        gap='medium'
                    >
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => noNickName()}
                        >
                            <Text
                                weight='bold'
                                size='large'
                            >
                                No
                            </Text>
                        </Box>
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => checkValidNickName()}
                        >
                            <Text
                                weight='bold'
                                size='large'
                            >
                                Submit
                            </Text>
                        </Box> 
                    </Box>
                </Box>
            </Box>
            <Box
                pad='large'
                onClick={() => {
                    setFirstName('')
                    setActiveTab('NameForm')
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

const LastNameForm = ({ setLastName, setActiveTab, setFirstName, setNickName }) => {
    const [value, setValue] = useState('')
    const [showError, setShowError] = useState(false)

    const onChange = (event) => {
        if (value === '') setShowError(true)
        else setShowError(false)
        setValue(event.target.value)
    }

    const checkValidLastName = () => {
        if (value === '') return setShowError(true)
        setActiveTab('SunriseForm')
        setLastName(value)
    }

    return (
        <Box
            fill
            round='small'
            alignContent='center'
            pad='medium'
            background='neutral-1'
            justify='between'
        >
            <Box
                gap='medium'
            >
                <Heading textAlign='center'>What is your last name?</Heading>
                <Box
                    gap='medium'
                >
                    <TextInput onChange={onChange}/>
                    <Box style={{ visibility: showError ? 'visible' : 'hidden' }}><Text color='red' weight='bold'>Required</Text></Box>
                    <Box
                        direction='row'
                        justify='center'
                        gap='medium'
                    >
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => checkValidLastName()}
                        >
                            <Text
                                weight='bold'
                                size='large'
                            >
                                Submit
                            </Text>
                        </Box> 
                    </Box>
                </Box>
            </Box>
            <Box
                pad='large'
                onClick={() => {
                    setFirstName('')
                    setNickName('')
                    setActiveTab('NameForm')
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

const SunriseForm = ({ setLastName, setActiveTab, setSunrise }) => {
    const [value, setValue] = useState('')
    const [showError, setShowError] = useState(false)

    const onChange = (event) => {
        const nextValue = event.value;
        setValue(nextValue);
    }

    const checkValid = () => {
        if (value === '') return setShowError(true)
        setActiveTab('ConfirmCard')
        setSunrise(value)
    }

    return (
        <Box
            fill
            round='small'
            alignContent='center'
            pad='medium'
            background='neutral-1'
            justify='between'
        >
            <Box
                gap='medium'
            >
                <Heading textAlign='center'>When is your birthday?</Heading>
                <Box
                    gap='medium'
                >
                    <Box alignSelf='center' width="medium" margin={{ vertical: 'small' }}>
                        <DateInput format="m/d/yy" value={value} onChange={onChange} />
                    </Box>
                    <Box style={{ visibility: showError ? 'visible' : 'hidden' }}><Text color='red' weight='bold'>Required</Text></Box>
                    <Box
                        direction='row'
                        justify='center'
                        gap='medium'
                    >
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => checkValid()}
                        >
                            <Text
                                weight='bold'
                                size='large'
                            >
                                Submit
                            </Text>
                        </Box> 
                    </Box>
                </Box>
            </Box>
            <Box
                pad='large'
                onClick={() => {
                    setLastName('')
                    setActiveTab('LastNameForm')
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

const ParentForm = ({ setLastName, setActiveTab, setSunrise }) => {
    const [value, setValue] = useState('')
    const [showError, setShowError] = useState(false)
    const [profile, setProfile] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [selectedProfileId, setSelectedProfileId] = useState(null);

    const onChange = (event) => {
        if (value === '') setShowError(true)
        else setShowError(false)
        
        setValue(event.target.value)
    }

    const checkValidLastName = () => {
        if (value === '') return setShowError(true)
        setActiveTab('SunriseForm')
        setLastName(value)
    }

    async function namesearch () {
        if (value === '') return setShowError(true) 
            console.log("value",value)
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
          
                // Update state with the search results
                setProfile(data);
              } catch (error) {
                console.error('Error searching profiles:', error.message);
              } finally {
                setLoading(false);
              }
        console.log(profile)
    }

    const handleShowMore = () => {
        setShowMore(true)
    }

    const displayProfile = showMore ? profile : profile.slice(0,5)

    const handleProfileClick = (id) => {
        setSelectedProfileId(id);
      };

    const handleConfirm = () => {
        // Perform the confirm action
        console.log('Profile confirmed:', selectedProfileId);
      };

    return (
        <Box
            fill
            round='small'
            alignContent='center'
            pad='medium'
            background='neutral-1'
            justify='between'
        >
            <Box
                gap='medium'
            >
                <Heading textAlign='center'>Who is your Smith family parent?</Heading>
                <Box
                    gap='medium'
                >
                    <TextInput 
                        icon={<Search/>}
                        onChange={onChange}
                    />
                    <Box style={{ visibility: showError ? 'visible' : 'hidden' }}><Text color='red' weight='bold'>Required</Text></Box>
                    <Box
                        direction='row'
                        justify='center'
                        gap='medium'
                    >
                        <Button 
                            onClick={() => namesearch()}
                            disabled={loading}
                        >
                            <Box
                                round='small'
                                background='light-1'
                                pad='medium'    
                            >
                                <Text
                                    weight='bold'
                                    size='large'
                                >
                                    Search1
                                </Text>
                            </Box>
                        </Button>
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => namesearch()}
                            
                        >
                            <Text
                                weight='bold'
                                size='large'
                            >
                                Search
                            </Text>
                        </Box>
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => checkValidLastName()}
                        >
                            <Text
                                weight='bold'
                                size='large'
                            >
                                Create Profile
                            </Text>
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
                                        border={{ color: 'brand', size: 'small' }}
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
                                                <Button
                                                label={`+${profile.length - 5} more`}
                                                onClick={handleShowMore}
                                                />
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
            <Box
                pad='large'
                onClick={() => {
                    setSunrise('')
                    setActiveTab('ParentForm')
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

const ConfirmCard = ({ setActiveTab, firstName, nickName, lastName, sunrise }) => {
    const navigate = useNavigate()
    const { session } = useSession()
    const userId = session?.user.id


    function formatDate(dateString) {
        const date = new Date(dateString);
      
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      
        const month = monthNames[date.getMonth()]; 
        const day = date.getDate();
        const year = date.getFullYear();
      
        return `${month} ${day}, ${year}`;
      }

      let formattedDate = formatDate(sunrise)

      const handleUpdate = async () => {

        const { data, error } = await supabase
            .from('profile')
            .update({ 
                firstname: firstName,
                nickname: nickName,
                lastname: lastName,
                sunrise
            })
            .eq('id', userId)

        if (error) {
            console.error('Error updating profile:', error);
        } else {
            console.log('Profile updated successfully:', data);
            navigate('/profile')
        }
      }

    return (
        <Box
            fill
            round='small'
            alignContent='center'
            pad='medium'
            background='neutral-1'
            justify='between'
        >
            <Box gap='medium'>
                <Heading textAlign='center'>Is this information Correct?</Heading>
                <Box direction='row' gap="medium" pad={{ horizontal: 'large'}}>
                    <Text size='large'>First Name:</Text>
                    <Text weight='bolder' size='large'>{firstName}</Text>
                </Box>
                {
                    nickName && (
                        <Box direction='row' gap="medium" pad={{ horizontal: 'large'}}>
                            <Text size='large'>Nickname: </Text>
                            <Text weight='bolder' size='large'>{nickName}</Text>
                        </Box>
                    )
                }
                <Box direction='row' gap="medium" pad={{ horizontal: 'large'}}>
                    <Text size='large'>Last Name: </Text>
                    <Text weight='bolder' size='large'>{lastName}</Text>
                </Box>
                <Box direction='row' gap="medium" pad={{ horizontal: 'large'}}>
                    <Text size='large'>Birthday: </Text>
                    <Text weight='bolder' size='large'>{formattedDate}</Text>
                </Box>
                <Button margin={{ top: 'medium'}} alignSelf='center' onClick={() => handleUpdate()}>
                    <Box width='small' round='small' background='blue' pad='medium'>Create profile</Box>
                </Button>
            </Box>

            <Box
                pad='large'
                onClick={() => {
                    setActiveTab('SunriseForm')
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

export default ProfileForm