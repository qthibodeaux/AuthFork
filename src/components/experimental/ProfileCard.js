import { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, Row } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { supabase } from '../../supabaseClient';
import moment from 'moment';

function ProfileCard({ data }) {
  const {
    firstname,
    nickname,
    lastname,
    avatar_url,
    sunrise,
    sunset,
    profilestate: [{ city, state: { state_name: state } = {} } = {}] = [],
  } = data;
  const [url, setUrl] = useState(null);

  const formattedSunrise = moment(sunrise).format('MMMM D, YYYY');
  const formattedSunset = sunset ? moment(sunset).format('MMMM D, YYYY') : null;

  useEffect(() => {
    const fetchPublicUrl = async () => {
      try {
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(avatar_url);
        setUrl(data.publicUrl);
      } catch (error) {
        console.error('Error fetching public URL:', error);
      }
    };

    if (avatar_url) {
      fetchPublicUrl();
    }
  }, [avatar_url]);

  return (
    <Card
      style={{
        backgroundColor: '#5b1f40',
        color: '#f3e7b1',
        fontWeight: 'bold',
      }}
    >
      <Row align={'middle'}>
        <Col span={6} style={{ textAlign: 'center' }}>
          {avatar_url ? (
            <img
              src={url}
              alt={firstname}
              style={{ width: '5rem', borderRadius: '10%' }}
            />
          ) : (
            <div>
              <Avatar
                icon={<UserOutlined />}
                shape="square"
                style={{ borderRadius: '8px', width: '5rem', height: '5rem' }}
              />
            </div>
          )}
        </Col>
        <Col span={18}>
          <Row style={{ marginLeft: '1rem' }}>
            <Col span={24}>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                {nickname ? `${firstname} ${nickname}` : firstname}
              </div>
            </Col>
          </Row>
          <Row style={{ marginLeft: '1rem' }}>
            <Col span={24}>
              <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                {lastname}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row style={{ marginTop: '.3rem' }}>
        <Col span={12}>
          <Row>Sunrise</Row>
          <Row style={{ color: 'white' }}>{formattedSunrise}</Row>
        </Col>
        <Col span={12}>
          {formattedSunset && (
            <div>
              <Row justify="end">Sunset</Row>
              <Row justify="end" style={{ color: 'white' }}>
                {formattedSunset}
              </Row>
            </div>
          )}
        </Col>
      </Row>

      <Row style={{ marginTop: '.7rem' }}>
        <Col flex="auto">
          <Row>Resides</Row>
          <Row style={{ color: 'white' }}>
            {city && (
              <div>
                {city}, {state}
              </div>
            )}
          </Row>
        </Col>
        <Col>
          <Button
            icon={<EditOutlined />}
            style={{
              backgroundColor: 'transparent',
              borderColor: '#EABEA9',
              fontWeight: 'bold',
              color: '#F7DC92',
            }}
          ></Button>
        </Col>
      </Row>
    </Card>
  );
}

export default ProfileCard;
