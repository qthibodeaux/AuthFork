import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Input,
  Avatar,
  Row,
  Col,
  Button,
  Typography,
  AutoComplete,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { supabase } from './../../supabaseClient'; // Ensure this import is correct

const { Title } = Typography;

const SearchCard = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debounceTimeout = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const fetchProfiles = async (searchTerm) => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const { data, error } = await supabase
      .from('profile')
      .select('id, firstname, nickname, lastname, avatar_url, sunrise')
      .or(
        `firstname.ilike.%${searchTerm}%,nickname.ilike.%${searchTerm}%,lastname.ilike.%${searchTerm}%`
      );

    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      setSearchResults(data);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      await fetchProfiles(value);
    }, 300);
  };

  const handleProfileSelect = (value, option) => {
    setSelectedProfile(option.profile);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleReset = () => {
    setSelectedProfile(null);
    setSearchTerm('');
  };

  const navigateToProfile = (profileId) => {
    navigate(`/profile/${profileId}`);
    console.log(`Navigate to profile: ${profileId}`);
  };

  const formattedOptions = searchResults.map((profile) => ({
    value: `${profile.firstname} ${
      profile.nickname ? `(${profile.nickname})` : ''
    } ${profile.lastname}`,
    label: `${profile.firstname} ${
      profile.nickname ? `(${profile.nickname})` : ''
    } ${profile.lastname}`,
    profile: profile,
  }));

  return (
    <Card title="Find A Member" style={{ width: '100%' }}>
      <AutoComplete
        options={formattedOptions}
        onSearch={handleSearchChange}
        onSelect={handleProfileSelect}
        placeholder="Search for a member"
        value={searchTerm}
        style={{ marginTop: '.5rem' }}
      >
        <Input
          style={{
            background: '#6c254c',
            border: 'none',
            color: '#f3e7b1',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            borderRadius: '0',
          }}
        />
      </AutoComplete>

      {selectedProfile && (
        <div style={{ marginTop: '16px' }}>
          <Row gutter={16} align="middle">
            <Col span={8}>
              <Avatar size={64} src={selectedProfile.avatar_url} />
            </Col>
            <Col span={16}>
              <Title level={5}>
                {selectedProfile.firstname}{' '}
                {selectedProfile.nickname && `(${selectedProfile.nickname})`}
              </Title>
              <div>{selectedProfile.lastname}</div>
              <div>
                {new Date(selectedProfile.sunrise).toLocaleDateString()}
              </div>
            </Col>
          </Row>
          <div style={{ marginTop: '16px' }}>
            <Button onClick={handleReset}>Reset</Button>
            <Button
              type="primary"
              style={{ marginLeft: '8px' }}
              onClick={() => navigateToProfile(selectedProfile.id)}
            >
              Choose {selectedProfile.nickname || selectedProfile.firstname}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SearchCard;
