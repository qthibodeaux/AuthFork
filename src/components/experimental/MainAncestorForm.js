import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Row, Col, Card, Typography, Image, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthConsumer from '../useSession';
import useParentDirector from './useParentDirector';

import alma from '../assets/alma.jpg';
import ben from '../assets/ben.jpg';
import bobbie from '../assets/bobbie.jpg';
import hazel from '../assets/hazel.jpg';
import james from '../assets/james.jpg';
import john from '../assets/john.jpg';
import joyce from '../assets/joyce.jpg';
import lorene from '../assets/lorene.jpg';
import loretta from '../assets/loretta.jpg';
import mary from '../assets/mary.jpg';
import sylvester from '../assets/sylvester.jpg';

const imageMap = {
    'Alma': alma,
    'Ben': ben,
    'Bobbie': bobbie,
    'Hazel': hazel,
    'James': james,
    'John': john,
    'Joyce': joyce,
    'Lorene': lorene,
    'Loretta': loretta,
    'Mary': mary,
    'Sylvester': sylvester,
};

function MainAncestorForm() {
    useParentDirector();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAncestor, setSelectedAncestor] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const navigate = useNavigate();
    const { session } = AuthConsumer();
    const { Title, Text } = Typography;

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profile')
                    .select('*')
                    .eq('branch', 1)
                    .order('sunrise', { ascending: true });

                if (error) {
                    throw error;
                }

                setProfiles(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    const goBack = () => navigate(`/profile/${session.user.id}`);

    const handleAvatarClick = (ancestor) => {
        const imageSrc = imageMap[ancestor.firstname] || 'https://via.placeholder.com/150';
        setSelectedAncestor({ ...ancestor, imageSrc });
        setShowWarning(false);
    };

    const handleConfirm = async () => {
        if (!selectedAncestor) {
            setShowWarning(true);
            return;
        }

        const { error } = await supabase
            .from('profile')
            .update({ ancestor: selectedAncestor.id })
            .eq('id', session.user.id);
        
        if (error) {
            console.log(error);
        }

        goToProfile();
    };

    const goToProfile = () => navigate(`/profile/${session.user.id}`);

    return (
        <Row justify="center" align="middle" style={{ padding: '16px' }}>
        <Col span={24}>
          <Card style={{ background: '#C77875', borderRadius: '8px', padding: '16px' }}>
            <Row justify="center" style={{ marginBottom: '16px' }}>
              {selectedAncestor && (
                <Col style={{ textAlign: 'center' }}>
                  <Image src={selectedAncestor.imageSrc} style={{ width: '5rem', height: '5rem', borderRadius: '10px' }} />
                  <Text strong>{selectedAncestor.firstname}</Text>
                </Col>
              )}
            </Row>
            <Row justify="center" style={{ marginBottom: '16px' }}>
              <Title level={2} style={{ textAlign: 'center', fontWeight: 'bold' }}>Who is your first branch ancestor?</Title>
            </Row>
            <Row justify="center" gutter={[16, 16]} className="profile-grid">
              {profiles.map((profile) => {
                const imageSrc = imageMap[profile.firstname] || 'https://via.placeholder.com/150';
                return (
                  <Col key={profile.id} className="profile-item" onClick={() => handleAvatarClick(profile)}>
                    <Image src={imageSrc} alt={profile.name} className="profile-avatar" />
                  </Col>
                );
              })}
            </Row>
            <Row justify="center" gutter={16} style={{ marginTop: '16px' }}>
              <Col>
                <Button shape="round" style={{ background: '#84543C', color: '#F7DC92' }} onClick={() => setSelectedAncestor(null)}>Reset</Button>
              </Col>
              <Col>
                <Button shape="round" type="primary" style={{ background: '#84543C', color: '#F7DC92' }} onClick={handleConfirm}>Submit</Button>
              </Col>
            </Row>
            {showWarning && (
              <Row justify="center" style={{ marginTop: '16px' }}>
                <Text type="danger" strong>Please select an ancestor before pressing submit</Text>
              </Row>
            )}
            <Row justify="center" style={{ marginTop: '24px' }}>
              <Button type="link" onClick={goBack}>
                <Text strong>Back</Text>
              </Button>
            </Row>
          </Card>
        </Col>
      </Row>
    );
}

export default MainAncestorForm;
