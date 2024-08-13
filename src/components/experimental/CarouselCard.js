import React, { useEffect, useState } from 'react';
import { Carousel, Card, Avatar, Spin, Typography, Row, Col } from 'antd';
import { supabase } from './../../supabaseClient'; // Ensure this import is correct

const { Title } = Typography;

const CarouselCard = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Call the get_random_profiles function with a limit of 5
        const { data, error } = await supabase.rpc('get_random_profiles', {
          p_limit: 5,
        });

        if (error) throw error;

        setProfiles(data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading)
    return (
      <div className="spinner">
        <Spin size="large" />
      </div>
    );

  return (
    <Card
      title="Family Member Spotlight"
      style={{ backgroundColor: '#f3e7b1', width: '100%' }}
    >
      <Carousel autoplay autoplaySpeed={10000}>
        {profiles.map((profile) => (
          <div key={profile.id}>
            <Row align="middle" gutter={16}>
              <Col span={12}>
                <Avatar shape="square" size={64} src={profile.avatar_url} />
              </Col>
              <Col span={12}>
                <Title level={5}>
                  {profile.firstname}{' '}
                  {profile.nickname ? `(${profile.nickname})` : ''}
                </Title>
                <div>{profile.lastname}</div>
                <div>{new Date(profile.sunrise).toLocaleDateString()}</div>
              </Col>
            </Row>
          </div>
        ))}
      </Carousel>
    </Card>
  );
};

export default CarouselCard;
