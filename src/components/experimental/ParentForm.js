import { useRef, useState } from 'react';
import {
  AutoComplete,
  Button,
  Card,
  Col,
  Input,
  List,
  Row,
  Spin,
  Typography,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { supabase } from '../../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import AuthConsumer from '../../useSession';
import useParentDirector from '../director/useParentDirector';

function ParentForm() {
  useParentDirector();
  const [value, setValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const navigate = useNavigate();
  const { session } = AuthConsumer();
  const { Title, Text } = Typography;
  const { userid } = useParams();

  const onChange = (event) => {
    if (value === '') setShowError(true);
    else setShowError(false);

    setValue(event.target.value);
  };

  const checkValidity = () => {
    if (value === '') return setShowError(true);
  };

  async function namesearch() {
    if (value === '') return setShowError(true);
    try {
      let { data, error } = await supabase
        .from('profile')
        .select('*')
        .or(
          `firstname.ilike.%${value}%,nickname.ilike.%${value}%,lastname.ilike.%${value}%`
        )
        .neq('branch', 0)
        .order('sunrise', { ascending: true });

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error searching profiles:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleShowMore = () => {
    setShowMore(true);
  };

  const displayProfile = showMore ? profile : profile.slice(0, 5);

  const handleProfileClick = (id) => {
    setSelectedProfileId(id);
  };

  const handleConfirm = async () => {
    const { error } = await supabase
      .from('profile')
      .update({ parent: selectedProfileId })
      .eq('id', session.user.id);

    if (error) {
      console.log(error);
    }

    goToProfile();
  };

  const goToProfile = () => navigate(`/profile/${session.user.id}`);

  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  const handleSearch = async (value) => {
    setInputValue(value);
    setSearchText(value);
    if (value) {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .or(
          `firstname.ilike.%${value}%,nickname.ilike.%${value}%,lastname.ilike.%${value}%`
        )
        .neq('branch', 0)
        .order('sunrise', { ascending: true });

      if (!error) {
        const formattedOptions = data.map((profile) => ({
          value: `${profile.firstname} ${
            profile.nickname ? `(${profile.nickname})` : ''
          } ${profile.lastname}`,
          label: `${profile.firstname} ${
            profile.nickname ? `(${profile.nickname})` : ''
          } ${profile.lastname}`,
          profile: profile,
        }));
        setOptions(formattedOptions);
      }
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (value) => {
    const selected = options.find((option) => option.value === value);
    if (selected) {
      setSelectedProfile(selected.profile);
      console.log(selected.profile);
    }
  };

  const handleReset = () => {
    setOptions([]);
    setSearchText('');
    setSelectedProfile(null);
    setInputValue('');
  };

  return (
    <div
      style={{ backgroundColor: '#f3e7b1', height: '100%', padding: '1rem' }}
    >
      <Card
        style={{
          background: '#5b1f40',
          padding: '16px',
          color: '#f3e7b1',
          fontWeight: 'bold',
        }}
      >
        <Title level={3} style={{ textAlign: 'center', color: '#f3e7b1' }}>
          Who is your Smith family parent?
        </Title>
        <Row justify="center" style={{ marginBottom: '16px' }}>
          <Col span={24}>
            <Input
              prefix={<SearchOutlined style={{ color: 'white' }} />}
              onChange={onChange}
              placeholder="Search"
              size="large"
              style={{
                background: '#6c254c',
                border: 'none',
                color: '#f3e7b1',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                borderRadius: '0',
              }}
            />
          </Col>
        </Row>
        {showError && (
          <Row justify="center" style={{ marginBottom: '16px' }}>
            <Text type="danger" strong>
              Required
            </Text>
          </Row>
        )}
        <Row justify="center" gutter={16} style={{ marginTop: '16px' }}>
          <Col>
            <Button
              style={{
                color: '#873D62',
                background: '#F7DC92',
                border: 'solid #EABEA9',
                fontWeight: 'bold',
              }}
              onClick={namesearch}
              disabled={loading}
            >
              Search
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              style={{
                color: '#873D62',
                background: '#F7DC92',
                border: 'solid #EABEA9',
                fontWeight: 'bold',
              }}
              onClick={checkValidity}
            >
              Create Profile
            </Button>
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: '16px' }}>
          {loading ? (
            <Spin tip="Loading..." />
          ) : (
            profile.length !== 0 && (
              <Card
                style={{
                  border: '1px solid #1890ff',
                  borderRadius: '8px',
                  padding: '16px',
                  height: '200px',
                  overflowY: 'auto',
                }}
              >
                <List
                  dataSource={displayProfile}
                  renderItem={(profile) => (
                    <List.Item
                      key={profile.id}
                      style={{
                        background:
                          selectedProfileId === profile.id ? '#e6f7ff' : '#fff',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleProfileClick(profile.id)}
                    >
                      <Text>
                        {profile.firstname} {profile.nickname}{' '}
                        {profile.lastname}
                      </Text>
                      {selectedProfileId === profile.id && (
                        <Button type="link" onClick={handleConfirm}>
                          Confirm
                        </Button>
                      )}
                    </List.Item>
                  )}
                />
                {!showMore && profile.length > 5 && (
                  <Button type="link" onClick={handleShowMore}>
                    +{profile.length - 5} more
                  </Button>
                )}
              </Card>
            )
          )}
        </Row>
        <Row justify="center" style={{ marginTop: '24px' }}>
          <Button
            onClick={goToProfile}
            style={{
              background: 'none',
              border: 'solid #EABEA9',
              color: '#F7DC92',
              fontWeight: 'bold',
            }}
          >
            Back
          </Button>
        </Row>
      </Card>

      <Card
        style={{
          background: '#5b1f40',
          border: 'none',
          borderRadius: '8px',
          padding: '8px',
        }}
      >
        <Title level={3} style={{ textAlign: 'center', color: '#f3e7b1' }}>
          Who is your Smith family parent?
        </Title>

        {selectedProfile && <div>{selectedProfile.firstname}</div>}

        <AutoComplete
          options={options}
          onSearch={handleSearch}
          placeholder="Search for names"
          onSelect={handleSelect}
          value={inputValue}
        >
          <Input
            ref={inputRef}
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

        <Row justify="center" gutter={16} style={{ marginTop: '16px' }}>
          <Col>
            <Button
              style={{
                color: '#F7DC92',
                background: 'none',
                border: '.15rem solid #EABEA9',
                fontWeight: 'bold',
              }}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              style={{
                color: '#873D62',
                background: '#F7DC92',
                border: '.15rem solid #EABEA9',
                fontWeight: 'bold',
              }}
              onClick={checkValidity}
            >
              Create Profile
            </Button>
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: '24px' }}>
          <Button
            onClick={goToProfile}
            style={{
              background: 'none',
              border: 'solid #EABEA9',
              color: '#F7DC92',
              fontWeight: 'bold',
            }}
          >
            Back
          </Button>
        </Row>
      </Card>
    </div>
  );
}

export default ParentForm;
