import { Button, Card, Col, Row, Typography } from 'antd';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CompleteProfileCard = ({ data, goToAvatar }) => {
  const { avatar_url, city, state } = data;
  const gta = () => {
    goToAvatar();
  };

  if (avatar_url && city) return null;

  return (
    <Card
      style={{
        backgroundColor: '#5B1F40',
        color: '#f3e7b1',
        fontWeight: 'bold',
      }}
    >
      <Row>
        <Title level={3} style={{ color: '#F3E7B1' }}>
          Complete Your Profile
        </Title>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          {!avatar_url && (
            <div>
              <div style={{ marginBottom: '8px' }}>Upload a picture</div>
              <Button
                icon={<UploadOutlined />}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#EABEA9',
                  fontWeight: 'bold',
                  color: 'white',
                }}
                onClick={gta}
              >
                Upload
              </Button>
            </div>
          )}
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {!city && (
          <Col span={24}>
            <div>Where do you currently live?</div>
            <Button
              icon={<EditOutlined />}
              style={{
                backgroundColor: 'transparent',
                borderColor: '#EABEA9',
                fontWeight: 'bold',
                color: 'white',
                marginTop: '8px',
              }}
            >
              Edit
            </Button>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default CompleteProfileCard;
