import React, { useEffect, useState } from 'react';
import { Carousel, Card, Avatar, Spin, Typography, Row, Col } from 'antd';
import { supabase } from './../../supabaseClient'; // Ensure this import is correct

const { Title } = Typography;

const CarouselCard = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch 5 random profiles using the RPC method
    const fetchRandomProfiles = async () => {
      try {
        const { data, error } = await supabase.rpc('get_random_profiles');

        if (error) throw error;

        setProfiles(data);
      } catch (error) {
        console.error('Error fetching random profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProfiles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Random Profiles</h3>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>
            {profile.firstname} {profile.lastname} - {profile.nickname}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarouselCard;
