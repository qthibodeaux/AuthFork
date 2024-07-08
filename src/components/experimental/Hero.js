import { useEffect, useState} from 'react';
import { Row, Col, Card, Image, Typography } from 'antd';
import AuthConsumer from '../useSession';
import { DownOutlined } from '@ant-design/icons';
import ancestors from '../assets/anc1.png'

function Hero () {
  const { Title, Text } = Typography
  return (
    <Row justify="center" align="middle" style={{ height: '100vh', background: 'linear-gradient(to right, #F4C967, #F7DC92 25%, #EABEA9 75%, #D7A58D)' }}>
    <Col span={24}>
      <Card bordered={false} style={{ background: 'transparent', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', padding: '24px' }}>
        <Title level={1} style={{ textAlign: 'center', color: '#C77875', fontWeight: 'bold', margin: '0' }}>
          Smith Family
        </Title>
        <Image
          src={ancestors}
          style={{ height: '66%', width: '100%', objectFit: 'cover', marginTop: '16px' }}
        />
        <DownOutlined style={{ fontSize: '32px', color: '#873D62' }} />
      </Card>
    </Col>
  </Row>
  );
};

const WelcomeBanner = () => {
  const { profile } = AuthConsumer()

  if (!profile) {
    return (
      <Row justify="center" align="middle" style={{ background: '#873D62', padding: '16px', flexWrap: 'wrap', border: '1rem solid black' }}>
      <Col span={24}>
        <Card bordered={false} style={{ background: 'transparent' }}>
          <Title level={2} style={{ color: '#fff' }}>
            Whether you are a Smith or a friend of the family, register your email to create a profile and join the tree.
          </Title>
        </Card>
      </Col>
    </Row>
    )
  }
}

export default Hero