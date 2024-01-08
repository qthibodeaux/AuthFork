import { Box, Image, Heading } from 'grommet'

function Profile() {
  return (
    <Box
      fill
      direction='column'
    >
        <Box>
          Image
          Title
          Name
          <Image src="https://www.resetera.com/data/avatar/31509371254/21577-m.jpg" />
        </Box>
        <Box>
          <Heading>Profile name</Heading>
        </Box>
    </Box>
  )
}

export default Profile