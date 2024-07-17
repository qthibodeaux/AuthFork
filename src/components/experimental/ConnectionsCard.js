import { Avatar, Button, Card, Col, Row, Typography } from 'antd';
import { EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Mary from '../../assets/mary.jpg';

const { Text, Title } = Typography;

const ConnectionsCard = ({ connectionGroups, parent }) => {
  const heya = () => {
    if (parent) console.log('parent', parent);
    else console.log('Yes parent');
  };

  return (
    <Card
      style={{ backgroundColor: '#5b1f40', border: 'none', color: '#f3e7b1' }}
    >
      <Row>
        <Title level={4} style={{ color: '#f3e7b1' }}>
          Connections
        </Title>
      </Row>
      <Row>
        <Col style={{ width: '100%' }}>
          <Row justify="space-between">
            <Col>
              <Title level={5} style={{ color: '#f3e7b1' }}>
                Parents
              </Title>
            </Col>
            <Col>
              <EditOutlined />
            </Col>
          </Row>
          <Row>
            {parent ? (
              <ParentPanel parent={parent} />
            ) : (
              <Button style={{ width: '100%' }} onClick={heya}>
                Add Parent
              </Button>
            )}
          </Row>
        </Col>
      </Row>
      <Row>
        <Col style={{ width: '100%' }}>
          <Row justify="space-between">
            <Col>
              <Title level={5} style={{ color: '#f3e7b1' }}>
                Spouse
              </Title>
            </Col>
            <Col>
              <EditOutlined />
            </Col>
          </Row>
          <Row>
            <Button onClick={() => console.log(parent)}>Data</Button>
            <Button onClick={() => console.log(connectionGroups)}>
              Groups
            </Button>
          </Row>
        </Col>
      </Row>
      <Row>
        <Row>
          <Title level={5}>Children</Title>
        </Row>
        <Row>Buttons</Row>
      </Row>
      <Button type="primary" icon={<EditOutlined />} size="small">
        Edit
      </Button>
    </Card>
  );
};

export default ConnectionsCard;

const ParentPanel = ({ parent }) => {
  return (
    <Row>
      <Col align="center" style={{ padding: '.25rem' }}>
        <Row justify="center">
          <Avatar shape="square" src={<PlusOutlined />} />
        </Row>
        <Row>
          <Text>{parent.firstname}</Text>
        </Row>
      </Col>
      <Col align="center" style={{ padding: '.25rem' }}>
        <Row justify="center">
          <Avatar shape="square" size="large" src={Mary} />
        </Row>
        <Row>
          <Text>{parent.firstname}</Text>
        </Row>
      </Col>
    </Row>
  );
};
