import { useState } from 'react'
import { Box, Button, Form, FormField, Grid, Heading, TextInput } from 'grommet'
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
    <Box fill>
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
            background='neutral-1'
            width='80%'
            alignSelf='center'
            round={{ size: 'small', corner: 'bottom' }}
            pad='medium'
            
        >
            
            <Box
                animation={{ type: 'fadeIn' }}
                            
            >
                <Heading level='2'>House of Mary</Heading>
                <Heading level='3'>4th Branch</Heading>
            </Box>
            
        </Box>
    )
}

const MainBox = ({ progress }) => {
    return (
        <Box
            direction='row'
            fill
            background='neutral-3'
        >
            <SideProgressionBox progress={progress}/>
            <ContentBox />
        </Box>
    )
}

const SideProgressionBox = ({ progress }) => {
    const heights = {
        0: { box1: 'xxsmall', box2: 'medium' },
        1: { box1: 'xxsmall', box2: 'medium' },
        2: { box1: 'xsmall', box2: 'small' },
        3: { box1: 'small', box2: 'xsmall' },
        4: { box1: 'medium', box2: 'xxsmall' },
    }

    const colors = {
        0: { col1: 'status-error', col2: 'neutral-1' },
        1: { col1: 'status-warning', col2: 'graph-0' },
        2: { col1: 'accent-4', col2: 'accent-4' },
        3: { col1: 'graph-0', col2: 'status-warning' },
        4: { col1: 'neutral-1', col2: 'status-error' },
    }
    //blank red orange yellow green
    const { box1, box2 } = heights[progress]
    const { col1, col2 } = colors[progress]


    return (
        <Box
            width='xsmall'
            fill='vertical'
            pad={{ horizontal: 'small', top: 'small', bottom: 'xlarge'}}
            align='center'
            justify='between'
        >
            <Box
                background={col1}
                round='small'
                width='xxsmall'
                height={box1}
                border={{
                    color: 'black',
                    size: 'medium'
                }}
            >
                
            </Box>
            <Box
                background={col2}
                round='small'
                width='xxsmall'
                height={box2}
                border={{
                    color: 'black',
                    size: 'medium'
                }}
            >
                
            </Box>
        </Box>
    )
}

const ContentBox = () => {
    const setMainAncestor = () => {}
    return (
        <Box
            background='neutral-3'
            fill
        >
            Content Box

            <AncestorForm setMainAncestor={setMainAncestor} />
        </Box>
    )
}

const AncestorForm = ({setMainAncestor}) => {
    return (
        <Box
            fill
            alignContent='center'
            pad='large'
        >
            <Heading margin={{ top: 'xlarge'}}>Who is your first branch ancestor?</Heading>
            <Box
                direction='row'
                gap="medium"
                height='xsmall'
                margin={{ top: 'xlarge'}}
            >
                <Box
                    round='small'
                    background='black'
                    pad='medium'
                    width='xsmall'
                    onClick={() => {setMainAncestor("Sylvestor")}}
                >
                    Sylvestor
                </Box>
                <Box
                    round='small'
                    background='black'
                    pad='medium'
                    width='xsmall'
                >
                    James
                </Box>
                <Box
                    round='small'
                    background='black'
                    pad='medium'
                    width='xsmall'
                >
                    Hazel
                </Box>
                <Box
                    round='small'
                    background='black'
                    pad='medium'
                    width='xsmall'
                >
                    Mary
                </Box>
            </Box>
            <Box
                direction='row'
                gap="medium"
                height='xsmall'
                margin={{ top: 'medium'}}
            >
                <Box
                    round='small'
                    background='black'
                    pad='medium'
                    width='xsmall'
                >
                    Jack
                </Box>
                <Box
                    round='small'
                    background='black'
                    pad='medium'
                    width='xsmall'
                >
                    Snake
                </Box>
                <Box
                    round='small'
                    background='black'
                    pad='medium'
                    width='xsmall'
                >
                    Irene
                </Box>
                <Box
                    round='small'
                    background='black'
                    pad='medium'
                    width='xsmall'
                >
                    Joyce
                </Box>
            </Box>
            <Box
                direction='row'
                gap="medium"
                height='xsmall'
                margin={{ top: 'medium'}}
            >
                <Box
                    round='small'
                    background='black'
                    pad='medium'
                    width='xsmall'
                >
                    Sylvestor
                </Box>
                <Box
                    round='small'
                    background='black'
                    pad='medium'
                    width='xsmall'
                >
                    Alma
                </Box>
            </Box>
            <Grid
                columns={{ count: 6, size: 'auto' }}
                rows={{ count: 3 }}
            >

            </Grid>
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
            <Heading margin={{ top: 'xlarge'}}>Who yo mama nem?</Heading>
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