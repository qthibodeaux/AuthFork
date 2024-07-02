import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Box, DateInput, Heading, Text, TextInput } from 'grommet';
import { supabase } from '../supabaseClient'
import AuthConsumer from '../useSession';
import useParentDirector from './useParentDirector'
import { v4 as uuidv4 } from 'uuid';

function CreateForm() {
    useParentDirector()
  const { type } = useParams()
  const navigate = useNavigate()

  const goToConnectionForm = () => navigate(`/connectionform/${type}`);

  const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [nickName, setNickName] = useState("")
    const [sunrise, setSunrise] = useState("")
    const [sunset, setSunset] = useState(null)
    
    const [activeTab, setActiveTab] = useState("NameForm")

    const MainPage = ({ activeTab }) => {
        let comp = <h1 style={{ backgroundColor: 'red', padding: '20px', fontWeight: 600, color: '#fff' }}>Developer Error: invalid tabId!</h1>;
        if (activeTab === 'NameForm') comp = <NameForm type={type} setActiveTab={setActiveTab} goToConnectionForm={goToConnectionForm} setFirstName={setFirstName} setNickName={setNickName} />;
        else if (activeTab === 'FirstNameForm') comp = <FirstNameForm setNickName={setNickName} setActiveTab={setActiveTab} setFirstName={setFirstName} />;
        else if (activeTab === 'LastNameForm') comp = <LastNameForm setLastName={setLastName} setActiveTab={setActiveTab} setFirstName={setFirstName} setNickName={setNickName} />;
        else if (activeTab === 'NickNameForm') comp = <NickNameForm setActiveTab={setActiveTab} setFirstName={setFirstName} setNickName={setNickName} />;
        else if (activeTab === 'SunriseForm') comp = <SunriseForm setActiveTab={setActiveTab} setSunrise={setSunrise} setLastName={setLastName} />;
        else if (activeTab === 'SunsetForm') comp = <SunsetForm setActiveTab={setActiveTab} setSunset={setSunset} />;
        else if (activeTab === 'ConfirmCard') comp = <ConfirmCard type={type} setActiveTab={setActiveTab} firstName={firstName} nickName={nickName} lastName={lastName} sunrise={sunrise} sunset={sunset} />; 

        return (
            <Box
                fill
                pad='small'
            >{comp}</Box>
        );
    }

  return (
    <Box
        fill
        gap='small'
    >
        <FormInfoBox firstName={firstName} nickName={nickName} lastName={lastName} sunrise={sunrise} />
        <MainPage activeTab={activeTab} /> 
    </Box>
  )
}

const FormInfoBox = ({ firstName, lastName, nickName, sunrise, sunset }) => {
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

    let formattedDate = formatDate(sunrise);
    let formattedSunset = formatDate(sunset); 

    return (
        <Box
            fill='horizontal'
            pad='small'
            style={{ visibility: firstName || nickName ? 'visible' : 'hidden' }}
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
                        <Box direction='row' align='center' justify='center' gap='medium'>
                            <Heading level='3'>Sunrise: </Heading>
                            <Heading level='3'>{formattedDate}</Heading>
                        </Box>
                    )}
                    {sunset && (
                        <Box direction='row' align='center' justify='center' gap='medium'>
                            <Heading level='3'>Sunset: </Heading>
                            <Heading level='3'>{formattedSunset}</Heading>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

const NameForm = ({ type, goToConnectionForm, setActiveTab, setFirstName, setNickName } ) => {
    const [value, setValue] = useState('')
    const [showError, setShowError] = useState(false)

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

    const getHeadingText = () => {
        switch(type) {
          case 'smithparent':
            return 'What do we call your Smith side parent?';
          case 'parent':
            return 'What do we call your parent?';
          case 'spouse':
            return 'What do we call your spouse?';
          case 'child':
            return 'What do we call your child?';
          default:
            return 'Does the profile exist?';
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
            <Box
                gap='medium'
            >
                <Heading textAlign='center'>{getHeadingText()}</Heading>
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
                onClick={() => goToConnectionForm()}
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
                <Heading textAlign='center'>What is their first name?</Heading>
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
                <Heading textAlign='center'>Do they have a nickname?</Heading>
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
                <Heading textAlign='center'>What is their last name?</Heading>
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
        setActiveTab('SunsetForm')
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
                <Heading textAlign='center'>When is their birthday?</Heading>
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

/*
const ConfirmCard = ({ type, setActiveTab, firstName, nickName, lastName, sunrise, sunset }) => {
    const navigate = useNavigate();
    const { session } = AuthConsumer();
    const userId = session?.user.id;

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

    let formattedDate = formatDate(sunrise);
    let formattedSunset = formatDate(sunset); 

    const createProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profile')
                .insert({
                    firstname: firstName,
                    nickname: nickName,
                    lastname: lastName,
                    sunrise,
                    sunset
                })
                .select()
    
            if (error) {
                console.error('Error updating profile:', error);
                return { success: false, error };
            } else {
                console.log('Profile updated successfully:', data);
                const updatedId = data[0]?.id; // Assuming data is an array with one element
                if (updatedId) {
                    navigate(`/profile/${updatedId}`);
                    return { success: true, data };
                } else {
                    return { success: false, error: 'No ID returned after update' };
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error.message);
            return { success: false, error: error.message };
        }
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
            <Box gap='medium'>
                <Heading textAlign='center'>Is this information Correct?</Heading>
                <Box direction='row' gap="medium" pad={{ horizontal: 'large' }}>
                    <Text size='large'>First Name:</Text>
                    <Text weight='bolder' size='large'>{firstName}</Text>
                </Box>
                {
                    nickName && (
                        <Box direction='row' gap="medium" pad={{ horizontal: 'large' }}>
                            <Text size='large'>Nickname: </Text>
                            <Text weight='bolder' size='large'>{nickName}</Text>
                        </Box>
                    )
                }
                <Box direction='row' gap="medium" pad={{ horizontal: 'large' }}>
                    <Text size='large'>Last Name: </Text>
                    <Text weight='bolder' size='large'>{lastName}</Text>
                </Box>
                <Box direction='row' gap="medium" pad={{ horizontal: 'large' }}>
                    <Text size='large'>Sunrise: </Text>
                    <Text weight='bolder' size='large'>{formattedDate}</Text>
                </Box>
                {
                    sunset && (
                        <Box direction='row' gap="medium" pad={{ horizontal: 'large' }}>
                            <Text size='large'>Sunset: </Text>
                            <Text weight='bolder' size='large'>{formattedSunset}</Text>
                        </Box>
                    )
                }
                <Box direction='row' gap='medium' justify='center'>
                    <Box
                        round='small'
                        background='light-1'
                        pad='medium'
                        onClick={() => createProfile()}
                    >
                        <Text
                            weight='bold'
                            size='large'
                        >
                            Confirm
                        </Text>
                    </Box>
                    <Box
                        round='small'
                        background='light-1'
                        pad='medium'
                        onClick={() => setActiveTab('NameForm')}
                    >
                        <Text
                            weight='bold'
                            size='large'
                        >
                            Edit
                        </Text>
                    </Box>
                </Box>
            </Box>
            <Box
                pad='large'
                onClick={() => {
                    setActiveTab('SunsetForm'); 
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    );
}*/

const ConfirmCard = ({ type, setActiveTab, firstName, nickName, lastName, sunrise, sunset }) => {
    const navigate = useNavigate();
    const { session } = AuthConsumer();
    const userId = session?.user.id;

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

    let formattedDate = formatDate(sunrise);
    let formattedSunset = formatDate(sunset); 

    const createProfile = async () => {
        try {
            const profileId = uuidv4(); // Generate UUID for profile
    
            const profileData = {
                id: profileId,
                firstname: firstName,
                nickname: nickName,
                lastname: lastName,
                sunrise
            };
    
            // Set parent for child profiles
            if (type === 'child') {
                profileData.parent = userId; // Set parent as current user
            }
    
            // Insert profile into 'profile' table
            const { data: profileInsertData, error: profileInsertError } = await supabase
                .from('profile')
                .insert(profileData)
                .select();
    
            if (profileInsertError) {
                console.error('Error updating profile:', profileInsertError);
                return { success: false, error: profileInsertError };
            }
    
            console.log('Profile successfully created:', profileInsertData);
    
            // Ensure profileInsertData is an array and get the profile ID
            const newProfileId = profileInsertData[0]?.id;
            if (!newProfileId) {
                console.error('Error: Profile ID not found after insert');
                return { success: false, error: 'Profile ID not found' };
            }
    
            if (['parent', 'spouse', 'child'].includes(type)) {
                const connectionTypeId = await getConnectionTypeId(type); // Implement this function to get connection type ID based on type
                let parentTypeId, childTypeId;
            
                if (type === 'parent' || type === 'child') {
                    parentTypeId = await getConnectionTypeId('parent');
                    childTypeId = await getConnectionTypeId('child');
                }
            
                if (connectionTypeId) {
                    let connectionData = [];
            
                    if (type === 'parent') {
                        // Parent connection
                        connectionData = [
                            { profile_1: userId, profile_2: newProfileId, connection_type: parentTypeId },
                            { profile_1: newProfileId, profile_2: userId, connection_type: childTypeId }
                        ];
                    } else if (type === 'child') {
                        // Child connection
                        connectionData = [
                            { profile_1: userId, profile_2: newProfileId, connection_type: childTypeId },
                            { profile_1: newProfileId, profile_2: userId, connection_type: parentTypeId }
                        ];
                    } else {
                        // Spouse connection
                        connectionData = [
                            { profile_1: userId, profile_2: newProfileId, connection_type: connectionTypeId },
                            { profile_1: newProfileId, profile_2: userId, connection_type: connectionTypeId }
                        ];
                    }
            
                    // Insert connection into 'connection' table
                    const { error: connectionInsertError } = await supabase
                        .from('connection')
                        .insert(connectionData);
            
                    if (connectionInsertError) {
                        console.error('Error inserting connection:', connectionInsertError);
                        return { success: false, error: connectionInsertError };
                    }
            
                    console.log('Connection inserted successfully.');
                } else {
                    console.error('Connection type ID not found for:', type);
                }
            }
    
            navigate(`/profile/${newProfileId}`);
            return { success: true, data: profileInsertData };
        } catch (error) {
            console.error('Error updating profile:', error.message);
            return { success: false, error: error.message };
        }
    };
    
    const getConnectionTypeId = async (typeName) => {
        // Implement logic to fetch connection type ID based on typeName from 'connection_type' table
        try {
            const { data, error } = await supabase
                .from('connection_type')
                .select('id')
                .eq('connection_name', typeName)
                .single();
    
            if (error) {
                console.error('Error fetching connection type:', error);
                return null;
            }
    
            return data?.id;
        } catch (error) {
            console.error('Error fetching connection type:', error.message);
            return null;
        }
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
            <Box gap='medium'>
                <Heading textAlign='center'>Is this information Correct?</Heading>
                <Box direction='row' gap="medium" pad={{ horizontal: 'large' }}>
                    <Text size='large'>First Name:</Text>
                    <Text weight='bolder' size='large'>{firstName}</Text>
                </Box>
                {
                    nickName && (
                        <Box direction='row' gap="medium" pad={{ horizontal: 'large' }}>
                            <Text size='large'>Nickname: </Text>
                            <Text weight='bolder' size='large'>{nickName}</Text>
                        </Box>
                    )
                }
                <Box direction='row' gap="medium" pad={{ horizontal: 'large' }}>
                    <Text size='large'>Last Name: </Text>
                    <Text weight='bolder' size='large'>{lastName}</Text>
                </Box>
                <Box direction='row' gap="medium" pad={{ horizontal: 'large' }}>
                    <Text size='large'>Sunrise: </Text>
                    <Text weight='bolder' size='large'>{formattedDate}</Text>
                </Box>
                {
                    sunset && (
                        <Box direction='row' gap="medium" pad={{ horizontal: 'large' }}>
                            <Text size='large'>Sunset: </Text>
                            <Text weight='bolder' size='large'>{formattedSunset}</Text>
                        </Box>
                    )
                }
                <Box direction='row' gap='medium' justify='center'>
                    <Box
                        round='small'
                        background='light-1'
                        pad='medium'
                        onClick={() => createProfile()}
                    >
                        <Text
                            weight='bold'
                            size='large'
                        >
                            Confirm
                        </Text>
                    </Box>
                    <Box
                        round='small'
                        background='light-1'
                        pad='medium'
                        onClick={() => setActiveTab('NameForm')}
                    >
                        <Text
                            weight='bold'
                            size='large'
                        >
                            Edit
                        </Text>
                    </Box>
                </Box>
            </Box>
            <Box
                pad='large'
                onClick={() => {
                    setActiveTab('SunsetForm'); 
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    );
}

const SunsetForm = ({ setActiveTab, setSunset }) => {
    const [value, setValue] = useState('');
    const [showError, setShowError] = useState(false);

    const onChange = (event) => {
        const nextValue = event.value;
        setValue(nextValue);
    };

    const checkValid = () => {
        if (value === '') return setShowError(true);
        setActiveTab('ConfirmCard');
        setSunset(value);
    };

    const goToConfirm = () => {
        setActiveTab('ConfirmCard');
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
                <Heading textAlign='center'>Have they passed away?</Heading> 
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
                            onClick={() => goToConfirm()}
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
                    setSunset('')
                    setActiveTab('SunriseForm');
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    );
}

export default CreateForm