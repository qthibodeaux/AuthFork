import { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, Form, Input, Row, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import Mary from '../assets/mary.jpg';

const { Text, Title } = Typography;

function ProfileEdit() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { userId } = useParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [avatarUrls, setAvatarUrls] = useState([]);
  const [connections, setConnections] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let { data, error } = await supabase
          .from('profile')
          .select(
            `
              id, firstname, nickname, lastname, avatar_url, ancestor, parent, sunrise, sunset,
              parent_profile:parent (id, firstname, nickname, lastname, avatar_url),
              ancestor_profile:ancestor (id, firstname, nickname, lastname, avatar_url),
              profilestate (
                city,
                state:state_id (state_name)
              )
            `
          )
          .eq('id', userId);

        if (error) throw error;
        if (data && data.length > 0) setData(data[0]);
        if (data && data.length > 0) setFormData(data[0]);

        // Fetch connections data
        const { data: connectionData, error: connectionError } = await supabase
          .from('connection')
          .select(
            `
            profile_2,
            connection_type:connection_type (connection_name)
          `
          )
          .eq('profile_1', userId);

        if (connectionError) throw connectionError;

        // Fetch profile details for connections
        const profileIds = connectionData.map((conn) => conn.profile_2);
        const { data: profileData, error: profileError } = await supabase
          .from('profile')
          .select(
            'id, firstname, nickname, lastname, avatar_url, sunrise, sunset'
          )
          .in('id', profileIds);

        if (profileError) throw profileError;

        // Map connection data with profile details
        const connectionsWithDetails = connectionData.map((conn) => ({
          ...conn,
          profile_2: profileData.find(
            (profile) => profile.id === conn.profile_2
          ),
        }));

        setConnections(connectionsWithDetails);

        // Fetch avatar URLs for current user and connections
        const userIds = [userId, ...profileIds];
        const avatarFetchPromises = userIds.map(async (id) => {
          const { data: profileAvatar, error: avatarError } =
            await supabase.storage.from('avatars').getPublicUrl(`${id}.jpg`);

          if (avatarError) {
            console.error(
              `Error fetching avatar for ${id}:`,
              avatarError.message
            );
            return null;
          }

          return profileAvatar?.data?.publicUrl || null;
        });

        const avatarUrls = await Promise.all(avatarFetchPromises);
        setAvatarUrls(avatarUrls.filter((url) => url !== null));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No profile found for this user.</div>;

  const { firstname } = data;

  return (
    <Row style={{ padding: '1rem' }}>
      <Title>Account Settings</Title>
      <Button onClick={() => console.log({ data })}>Get Data</Button>

      <ProfileInfo data={data} />
      <AvatarInfo avatar_url={data.avatar_url} userId={userId} />
      <AncestorInfo />
      <SmithParentInfo />
      <ConnectionsInfo />
    </Row>
  );
}

export default ProfileEdit;

const ProfileInfo = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <Card
      title="Profile Information"
      style={{ backgroundColor: '#f3e7b1', width: '100%' }}
    >
      <Form
        layout="vertical"
        style={{ backgroundColor: '#f3e7b1', width: '100%' }}
      >
        {[
          'firstname',
          'nickname',
          'lastname',
          'sunrise',
          'sunset',
          'email',
        ].map((field) => (
          <Form.Item
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
          >
            {isEditing ? (
              <Input
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            ) : (
              <span>{formData[field]}</span>
            )}
          </Form.Item>
        ))}
        <Row justify="end">
          <Col>
            <Button
              type="primary"
              onClick={isEditing ? handleSave : handleEditClick}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

const AvatarInfo = ({ avatar_url, userId }) => {
  const [url, setUrl] = useState(null);
  const navigate = useNavigate();

  const goToAvatar = () => navigate(`/antavatar/${userId}`);

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
    <Row>
      <Col>
        <img
          src={url}
          alt={url}
          style={{ width: '5rem', borderRadius: '10%' }}
        />
      </Col>
      <Col>
        <Button onClick={goToAvatar}>Ant Avatar</Button>
      </Col>
    </Row>
  );
};

const AncestorInfo = ({ ancestor }) => {
  const navigate = useNavigate();

  const goToMainAncestorForm = () => navigate('/mainancestorform');

  return (
    <Card style={{ backgroundColor: '#f3e7b1', width: '100%' }}>
      {!ancestor ? (
        <Col>
          <Row>
            <Avatar shape="square" size={64} src={Mary} />
            <h2 style={{ marginLeft: '1rem' }}>Mary Thibodeaux</h2>
          </Row>
          <Row>
            <Button>Remove Mary as your main ancestor</Button>
          </Row>
        </Col>
      ) : (
        <Row justify="space-between">
          <Col>Which branch do you belong to?</Col>
          <Col>
            <Button
              icon={<EditOutlined />}
              style={{
                backgroundColor: 'transparent',
                borderColor: '#EABEA9',
                fontWeight: 'bold',
                color: 'white',
              }}
              onClick={() => goToMainAncestorForm()}
            ></Button>
          </Col>
        </Row>
      )}
    </Card>
  );
};
const SmithParentInfo = () => {
  return <div>SmithParent Info</div>;
};
const ConnectionsInfo = () => {
  return <div>Connections Info</div>;
};
