import { useState } from 'react'
import { Box, Button, Card, Grid, Heading, Text, TextInput } from 'grommet'
import { FormPreviousLink } from 'grommet-icons'

function ProfileForm () {
    const [formVariable, setFormVariable] = useState('2')
    const [mainAncestor, setMainAncestor] = useState("Mary")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [nickName, setNickName] = useState("Lady")
    const [parent, setParent] = useState("")
    const [sunrise, setSunrise] = useState("")
    
    const [activeTab, setActiveTab] = useState("FirstNameForm")

    const MainPage = ({ activeTab }) => {
        let comp = <h1 style={{backgroundColor: 'red', padding: '20px', fontWeight: 600, color: '#fff'}}>Developer Error: invalid tabId!</h1>
        if (activeTab === 'AncestorForm') comp = <AncestorForm setMainAncestor={setMainAncestor} setFormVariable={setFormVariable} setActiveTab={setActiveTab}/>
        else if (activeTab === 'NameForm') comp = <NameForm setMainAncestor={setMainAncestor} setFormVariable={setFormVariable} setActiveTab={setActiveTab} setFirstName={setFirstName} setNickName={setNickName} />
        else if (activeTab === 'FirstNameForm') comp = <FirstNameForm setNickName={setNickName} setFormVariable={setFormVariable} setActiveTab={setActiveTab} setFirstName={setFirstName} />
        else if (activeTab === 'LastNameForm') comp = <LastNameForm setLastName={setLastName} setFormVariable={setFormVariable} setActiveTab={setActiveTab} setFirstName={setFirstName} setNickName={setNickName} />
        else if (activeTab === 'NickNameForm') comp = <NickNameForm setMainAncestor={setMainAncestor} setFormVariable={setFormVariable} setActiveTab={setActiveTab} setFirstName={setFirstName} />
        else if (activeTab === 'ParentForm') comp = <ParentForm setMainAncestor={setMainAncestor} setFormVariable={setFormVariable} />
        else if (activeTab === 'SunriseForm') comp = <SunriseForm setMainAncestor={setMainAncestor} setFormVariable={setFormVariable} />
        
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
        <PeakerBox mainAncestor={mainAncestor} />
        <FormInfoBox firstName={firstName} nickName={nickName} lastName={lastName} parent={parent} sunrise={sunrise} />
        <TopProgressionBox formVariable={formVariable}/>
        <MainPage activeTab={activeTab} /> 
    </Box>
  )
}

const ParentForm = () => {return <Box>PF</Box>}
const SunriseForm = () => {return <Box>SRF</Box>}


const PeakerBox = ({ mainAncestor }) => {
    return (
        <Box
            fill='horizontal'
            pad={{ horizontal: 'small'}}
            style={{ visibility: mainAncestor ? 'visible' : 'hidden'}}
        >
            <Box
                background='neutral-1'
                alignSelf='center'
                round={{ size: 'small', corner: 'bottom' }}
                pad='medium'
                fill='horizontal'
                animation={{ type: 'fadeIn' }}
            >
                {mainAncestor === 'Friend of Family' ? <Heading level='2' textAlign='center'>{mainAncestor}</Heading> : <Heading level='2' textAlign='center'>House of {mainAncestor}</Heading>}
                <Heading level='3' textAlign='center'>4th Branch</Heading>  
            </Box>
        </Box>
    )
}

const FormInfoBox = ({ firstName, lastName, nickName, parent, sunrise}) => {
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
                        <Heading >{firstName}</Heading>
                        {nickName && <Heading >{nickName}</Heading>}
                        <Heading >{lastName}</Heading>
                    </Box>
                    <Box direction='row' align='center' justify='center'>
                        {parent && <Heading >Child of {parent}</Heading>}
                    </Box>
                    <Box direction='row' align='center' justify='center'>
                        <Heading >{sunrise}</Heading>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const TopProgressionBox = ({ formVariable }) => {
    const heights = {
        0: { box1: '1rem' },
        1: { box1: '25%' },
        2: { box1: '50%' },
        3: { box1: '75%' },
        4: { box1: '100$' },
    }

    const colors = {
        0: { col1: 'status-error' },
        1: { col1: 'status-warning' },
        2: { col1: 'accent-4' },
        3: { col1: 'graph-0' },
        4: { col1: 'neutral-1' },
    }
    //blank red orange yellow green
    const { box1 } = heights[formVariable]
    const { col1 } = colors[formVariable]


    return (
        <Box
            pad={{ horizontal: 'small'}}
        >
            <Box
                background={col1}
                round='xsmall'
                width={box1}
                height='1rem'
            ></Box>
        </Box>
    )
}

const AncestorForm = ({ setMainAncestor, setFormVariable, setActiveTab }) => {
    let textsize = 'xsmall'
    const names = ["Sylvestor", "Jack", "Ben", "John", "Loretta", "Hazel", "Bobbie", "Joyce", "Lorene", "Alma", "Friend of Family"]
    const cards = names.map((name, i) => {
        if (name === "Friend of Family") return <Text key={i} size={textsize}>{name}</Text>
        return <Text key={i}>{name}</Text>
    })
        
    return (
        <Box
            fill
            round='small'
            alignContent='center'
            pad='medium'
            background='neutral-1'
            gap='medium'
        >
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
                                setFormVariable('1')
                                setActiveTab('NameForm')
                            }}
                        >
                            {cards[index]}
                        </Card>)
                    }
                )}
                
            </Grid>
        </Box>
    )
}

const NameForm = ({ setMainAncestor, setFormVariable, setActiveTab, setFirstName, setNickName } ) => {
    const [value, setValue] = useState('')
    const [showError, setShowError] = useState(false)
    const onChange = (event) => {
        if (value === '') setShowError(true)
        else setShowError(false)
        setValue(event.target.value)
    }

    const checkValidFirstName = () => {
        if (value === '') return setShowError(true) 
        setFormVariable('2')
        setActiveTab('NickNameForm')
        setFirstName(value)
    }

    const checkValidNickName = () => {
        if (value === '') return setShowError(true) 
        setFormVariable('2')
        setActiveTab('FirstNameForm')
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
                onClick={() => {
                    setMainAncestor('')
                    setActiveTab('AncestorForm')
                    setFormVariable('0')
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

const FirstNameForm = ({ setNickName, setFormVariable, setActiveTab, setFirstName }) => {
    const [value, setValue] = useState('')
    const onChange = (event) => setValue(event.target.value)

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
                    <Box
                        direction='row'
                        justify='center'
                        gap='medium'
                    >
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => {
                                setFormVariable('3')
                                setActiveTab('LastNameForm')
                                setFirstName(value)
                            }}
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
                    setFormVariable('1')
                    setActiveTab('NameForm')
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

const NickNameForm = ({ setNickName, setFormVariable, setActiveTab, setFirstName }) => {
    const [value, setValue] = useState('')
    const onChange = (event) => setValue(event.target.value)

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
                    <Box
                        direction='row'
                        justify='center'
                        gap='medium'
                    >
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => {
                                setFormVariable('3')
                                setActiveTab('LastNameForm')
                            }}
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
                            onClick={() => {
                                setFormVariable('3')
                                setActiveTab('LastNameForm')
                                setNickName(value)
                            }}
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
                    setFormVariable('1')
                    setActiveTab('NameForm')
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

const LastNameForm = ({ setLastName, setFormVariable, setActiveTab, setFirstName, setNickName }) => {
    const [value, setValue] = useState('')
    const onChange = (event) => setValue(event.target.value)

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
                    <Box
                        direction='row'
                        justify='center'
                        gap='medium'
                    >
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
                            onClick={() => {
                                setFormVariable('4')
                                setActiveTab('SunriseForm')
                                setLastName(value)
                            }}
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
                    setFormVariable('1')
                    setActiveTab('NameForm')
                }}
            >
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

export default ProfileForm