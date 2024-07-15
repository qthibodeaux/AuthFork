import { useState } from 'react';
import { Button, Col, Card, DatePicker, message, Row, Typography } from 'antd';
const { Title, Text } = Typography;

const SunsetForm = ({ setActiveTab, setSunset }) => {
  const [date, setDate] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleDateChange = (date, dateString) => {
    setDate(dateString);
    if (showError) setShowError(false);
  };

  const handleSubmit = () => {
    if (!date) {
      setShowError(true);
      message.error('Date is required');
    } else {
      setActiveTab('ConfirmCard');
      setSunset(date);
    }
  };

  const goToConfirm = () => {
    setActiveTab('ConfirmCard');
  };

  return (
    <Row style={{ background: '#f3e7b1', padding: '1rem' }}>
      <Col span={24}>
        <Card
          style={{
            background: '#5b1f40',
            border: 'none',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <Title
            level={3}
            style={{
              textAlign: 'center',
              color: '#f3e7b1',
              fontWeight: 'bold',
              fontSize: '2rem',
            }}
          >
            Have they passed away?
          </Title>
          <Row justify="center" style={{ marginBottom: '16px' }}>
            <DatePicker
              format="MM/DD/YY"
              onChange={handleDateChange}
              style={{
                background: '#6c254c',
                border: 'none',
                color: '#f3e7b1',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                borderRadius: '0',
              }}
              inputReadOnly
            />
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
                onClick={goToConfirm}
                style={{
                  color: '#873D62',
                  background: '#F7DC92',
                  border: 'solid #EABEA9',
                  fontWeight: 'bold',
                }}
              >
                No
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={handleSubmit}
                style={{
                  color: '#873D62',
                  background: '#F7DC92',
                  border: 'solid #EABEA9',
                  fontWeight: 'bold',
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>
          <Row justify="center" style={{ marginTop: '24px' }}>
            <Button
              style={{
                background: 'none',
                border: 'solid #EABEA9',
                color: '#F7DC92',
                fontWeight: 'bold',
              }}
              onClick={() => {
                setDate('');
                setShowError(false);
                setActiveTab('sunriseForm');
              }}
            >
              Back
            </Button>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
export default SunsetForm;
