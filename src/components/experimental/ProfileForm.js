import { useState } from 'react'
import { Box, Button, Card, Form, FormField, Grid, Heading, Text, TextInput } from 'grommet'
import { FormPreviousLink } from 'grommet-icons'

function ProfileForm() {
    const [formArray, setFormArray] = useState([])
    const [formVariable, setFormVariable] = ('4')
    const [mainAncestor, setMainAncestor] = useState(null)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [nickName, setNickName] = useState("")
    const [parent, setParent] = useState("")
    const [sunrise, setSunrise] = useState("")
    

  return (
    <Box
        fill
        gap='medium'
    >
        <PeakerBox />
        <MainBox progress={formVariable} />
        <Box>
            Todo: Components
            PeakerButton
            Side Progression Bar
            Completed Items Box
            QuestionBox
        </Box>
        
    </Box>
  )
}

const PeakerBox = () => {
    return (
        <Box
            fill='horizontal'
            pad={{ horizontal: 'small'}}
        >
            <Box
                background='neutral-1'
                alignSelf='center'
                round={{ size: 'small', corner: 'bottom' }}
                pad='medium'
                fill='horizontal'
            >
                <Box
                    animation={{ type: 'fadeIn' }}
                                
                >
                    <Heading level='2'>House of Mary</Heading>
                    <Heading level='3'>4th Branch</Heading>
                </Box>
            </Box>
        </Box>
    )
}

const MainBox = ({ progress }) => {
    return (
        <Box
            fill
            gap='medium'
        >
            <FormInfoBox />
            <TopProgressionBox progress={progress}/>
            <ContentBox />
        </Box>
    )
}

const FormInfoBox = () => {
    return (
        <Box
            fill='horizontal'
            pad='small'
        >
            <Box
                fill='horizontal'
                background='brand'
                round='small'
                pad='medium'
            >
                <Box direction='column' gap='medium'>
                    <Box direction='row'>
                        <Heading>Quintus</Heading>
                        <Heading> Thibodeaux</Heading>
                    </Box>
                    <Box direction='row'>
                        <Heading>Son of JoAnn</Heading>
                    </Box>
                    <Box direction='row'>
                        <Heading>April 16 1985</Heading>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const TopProgressionBox = ({ progress }) => {
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
    const { box1 } = heights[progress]
    const { col1 } = colors[progress]


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

const ContentBox = () => {
    const setMainAncestor = () => {}
    const [comp, setComp] = useState(<NameForm setMainAncestor={setMainAncestor} />)
    return (
        <Box
            fill
            pad='small'
        >
            {comp}
        </Box>
    )
}



const AncestorForm = ({setMainAncestor}) => {
    const cards = ["Sylvestor", "Jack", "Ben", "John", "Loretta", "Hazel", "Bobbie", "Joyce", "Lorene", "Alma"]
        .map((name, i) => <Text key={i}>{name}</Text>)
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
                {cards.map((card, index) => (
                    <Card
                        background='black'
                        pad='large'
                        key={index}
                    >
                        {card}
                    </Card>
                ))}
                
            </Grid>
        </Box>
    )
}

const NameForm = () => {

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
                    <TextInput />
                    <Box
                        direction='row'
                        justify='center'
                        gap='medium'
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
                                First name?
                            </Text>
                        </Box> 
                        <Box
                            round='small'
                            background='light-1'
                            pad='medium'
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
            <Box pad='large'>
                <Text textAlign='center' weight='bold' size='large'>Back</Text>
            </Box>
        </Box>
    )
}

const FormTemplate = () => {
    return (
        <Box
            fill
            alignContent='center'
            pad='large'
        >
            <Heading >Who yo mama nem?</Heading>
            <TextInput />
            <Box>
                <Box
                    justify='center'
                    align='center'
                    width='3rem'
                    height='3rem'
                    background='neutral-1'
                    round='small'
                >
                    <Button fill icon={<FormPreviousLink />} />
                </Box>
                <Button label='Back'/>
                <Button label='Submit' primary/>
            </Box>
        </Box>
    )
}

export default ProfileForm