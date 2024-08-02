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
      <AncestorInfo
        ancestor={data.ancestor}
        ancestor_profile={data.ancestor_profile}
        userId={userId}
      />
      <SmithParentInfo
        parent={data.parent}
        parent_profile={data.parent_profile}
        userId={userId}
      />

      <ConnectionsInfo userId={userId} />
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

const AncestorInfo = ({ ancestor, ancestor_profile, userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const removeAncestor = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profile')
        .update({ ancestor: null })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      console.log('Ancestor removed successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error removing ancestor:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goToMainAncestorForm = () => navigate('/mainancestorform');

  return (
    <Card style={{ backgroundColor: '#f3e7b1', width: '100%' }}>
      {ancestor ? (
        <Col>
          <Row>
            <Avatar shape="square" size={64} src={Mary} />
            <h2 style={{ marginLeft: '1rem' }}>{ancestor_profile.firstname}</h2>
          </Row>
          <Row>
            <Button onClick={removeAncestor} disabled={isLoading}>
              {' '}
              {isLoading ? 'Removing...' : 'Remove Ancestor'}
            </Button>
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

const SmithParentInfo = ({ parent, parent_profile, userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const removeParent = async () => {
    setIsLoading(true);
    try {
      // Remove the parent from the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .update({ parent: null })
        .eq('id', userId);

      if (profileError) {
        throw profileError;
      }

      // Get the connection type ID for 'child'
      const { data: connectionTypeData, error: connectionTypeError } =
        await supabase
          .from('connection_type')
          .select('id')
          .eq('connection_name', 'child')
          .single();

      if (connectionTypeError) {
        throw connectionTypeError;
      }

      const connectionTypeId = connectionTypeData.id;

      // Remove the connection where profile_1 is the parent and profile_2 is the user
      const { data: connectionData, error: connectionError } = await supabase
        .from('connection')
        .delete()
        .eq('profile_1', parent)
        .eq('profile_2', userId)
        .eq('connection_type', connectionTypeId);

      if (connectionError) {
        throw connectionError;
      }

      console.log('Parent and connection removed successfully');
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error removing parent and connection:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goToParents = () => navigate(`/parentform/${userId}`);

  return (
    <Card style={{ backgroundColor: '#f3e7b1', width: '100%' }}>
      {parent ? (
        <Col>
          <Row>
            <Avatar shape="square" size={64} src={Mary} />
            <h2 style={{ marginLeft: '1rem' }}>{parent_profile.firstname}</h2>
          </Row>
          <Row>
            <Button onClick={removeParent} disabled={isLoading}>
              {' '}
              {isLoading ? 'Removing...' : 'Remove Smith Side Parent'}
            </Button>
          </Row>
        </Col>
      ) : (
        <Row justify="space-between">
          <Col>Add Smith Side Parent?</Col>
          <Col>
            <Button
              icon={<EditOutlined />}
              style={{
                backgroundColor: 'transparent',
                borderColor: '#EABEA9',
                fontWeight: 'bold',
                color: 'white',
              }}
              onClick={() => goToParents()}
            ></Button>
          </Col>
        </Row>
      )}
    </Card>
  );
};

const ConnectionsInfo = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState([]);
  const [connectionTypes, setConnectionTypes] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch connection types
        const { data: connectionTypeData, error: connectionTypeError } =
          await supabase.from('connection_type').select('id, connection_name');

        if (connectionTypeError) throw connectionTypeError;

        const connectionTypeMap = connectionTypeData.reduce((acc, type) => {
          acc[type.connection_name] = type.id;
          return acc;
        }, {});

        setConnectionTypes(connectionTypeMap);

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
            'id, firstname, nickname, lastname, avatar_url, parent, sunrise, sunset'
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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const removeConnection = async (profile1, profile2, connectionType) => {
    setLoading(true);
    try {
      const connectionTypeId = connectionTypes[connectionType];
      if (!connectionTypeId)
        throw new Error(`Connection type ${connectionType} not found`);

      // Remove the specified connections
      await supabase
        .from('connection')
        .delete()
        .match({
          profile_1: profile1,
          profile_2: profile2,
          connection_type: connectionTypeId,
        });
      await supabase
        .from('connection')
        .delete()
        .match({
          profile_1: profile2,
          profile_2: profile1,
          connection_type: connectionTypeId,
        });

      // Refresh connections data
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

      const profileIds = connectionData.map((conn) => conn.profile_2);
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select(
          'id, firstname, nickname, lastname, avatar_url, parent, sunrise, sunset'
        )
        .in('id', profileIds);

      if (profileError) throw profileError;

      const connectionsWithDetails = connectionData.map((conn) => ({
        ...conn,
        profile_2: profileData.find((profile) => profile.id === conn.profile_2),
      }));

      setConnections(connectionsWithDetails);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeChildConnection = async (parentProfile, childProfile) => {
    setLoading(true);
    try {
      const parentConnectionTypeId = connectionTypes['parent'];
      const childConnectionTypeId = connectionTypes['child'];

      if (!parentConnectionTypeId || !childConnectionTypeId) {
        throw new Error('Connection type not found');
      }

      // Check if user is listed as a parent in the child's profile
      const { data: childData, error: childError } = await supabase
        .from('profile')
        .select('parent')
        .eq('id', childProfile);

      if (childError) throw childError;

      const childProfileData = childData[0];

      if (childProfileData.parent === parentProfile) {
        // Remove parent from child's profile
        await supabase
          .from('profile')
          .update({ parent: null })
          .eq('id', childProfile);
      }

      // Remove the specified connections
      await supabase
        .from('connection')
        .delete()
        .match({
          profile_1: userId,
          profile_2: childProfile,
          connection_type: parentConnectionTypeId,
        });
      await supabase
        .from('connection')
        .delete()
        .match({
          profile_1: childProfile,
          profile_2: userId,
          connection_type: childConnectionTypeId,
        });

      // Refresh connections data
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

      const profileIds = connectionData.map((conn) => conn.profile_2);
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select(
          'id, firstname, nickname, lastname, avatar_url, parent, sunrise, sunset'
        )
        .in('id', profileIds);

      if (profileError) throw profileError;

      const connectionsWithDetails = connectionData.map((conn) => ({
        ...conn,
        profile_2: profileData.find((profile) => profile.id === conn.profile_2),
      }));

      setConnections(connectionsWithDetails);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Group connections by type for rendering
  const connectionGroups = connections.reduce((acc, conn) => {
    const type = conn.connection_type.connection_name;
    if (!acc[type]) acc[type] = [];
    acc[type].push(conn);
    return acc;
  }, {});

  return (
    <Card title="Connections">
      {/* Parents */}
      {connectionGroups.parent && connectionGroups.parent.length > 0 && (
        <div>
          <h3>Parents</h3>
          {connectionGroups.parent.map((conn) => (
            <Row key={conn.profile_2.id} justify="space-between" align="middle">
              <Col>
                {conn.profile_2.firstname} {conn.profile_2.lastname}
              </Col>
              <Col>
                <Button
                  onClick={() =>
                    removeConnection(conn.profile_2.id, userId, 'parent')
                  }
                  loading={loading}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          ))}
        </div>
      )}
      {/* Spouses */}
      {connectionGroups.spouse && connectionGroups.spouse.length > 0 && (
        <div>
          <h3>Spouse</h3>
          {connectionGroups.spouse.map((conn) => (
            <Row key={conn.profile_2.id} justify="space-between" align="middle">
              <Col>
                {conn.profile_2.firstname} {conn.profile_2.lastname}
              </Col>
              <Col>
                <Button
                  onClick={() =>
                    removeConnection(conn.profile_2.id, userId, 'spouse')
                  }
                  loading={loading}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          ))}
        </div>
      )}
      {/* Children */}
      {connectionGroups.child && connectionGroups.child.length > 0 && (
        <div>
          <h3>Children</h3>
          {connectionGroups.child.map((conn) => (
            <Row key={conn.profile_2.id} justify="space-between" align="middle">
              <Col>
                {conn.profile_2.firstname} {conn.profile_2.lastname}
              </Col>
              <Col>
                <Button
                  onClick={() =>
                    removeChildConnection(userId, conn.profile_2.id)
                  }
                  loading={loading}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          ))}
        </div>
      )}
    </Card>
  );
};
