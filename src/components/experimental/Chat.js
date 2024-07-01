import React from 'react';
import { Box, Heading, Image, Layer } from 'grommet';
import ancestors from '../assets/ancestors.jpg'
import "./Chat.css"

const Hero = () => {
  return (
    <Box
      height="100vh"
      width="100%"
      style={{
        background: 'linear-gradient(to right, #F4C967, #F7DC92 25%, #EABEA9 75%, #D7A58D)',
        position: 'relative',
      }}
    >
      <Layer
        full
        plain
        background={{
          color: 'black',
          opacity: 'medium',
        }}
      />
      <Box
        direction="column"
        align="center"
        justify="center"
        fill
        pad="medium"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Heading level={1} margin="none" color="white">
          Smith Family
        </Heading>
        <Box
          height="2/3"
          width="large"
          margin={{ top: 'medium' }}
          border={{ color: 'rgba(255,255,255,0.5)', size: 'large', style: 'solid' }}
          style={{ borderImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0)) 1 100%' }}
        >
          <Image fit="cover" src={ancestors} />
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
