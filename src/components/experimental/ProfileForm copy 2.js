import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Row, Col, Card, Typography, Input, Button, DatePicker } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import AuthConsumer from '../../useSession';
import useParentDirector from '../director/useParentDirector';
import { v4 as uuidv4 } from 'uuid';
const { Title, Text } = Typography;

function ProfileForm() {
  useParentDirector();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickName, setNickName] = useState('');
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState(null);

  const { type } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('NameForm');

  const MainPage = ({ activeTab }) => {
    let comp = (
      <h1
        style={{
          backgroundColor: 'red',
          padding: '20px',
          fontWeight: 600,
          color: '#fff',
        }}
      >
        Developer Error: invalid tabId!
      </h1>
    );
    if (activeTab === 'NameForm')
      comp = (
        <NameForm
          setActiveTab={setActiveTab}
          setFirstName={setFirstName}
          setNickName={setNickName}
          type={type}
        />
      );
    else if (activeTab === 'FirstNameForm')
      comp = (
        <FirstNameForm
          setNickName={setNickName}
          setActiveTab={setActiveTab}
          setFirstName={setFirstName}
          setSunset
          type={type}
        />
      );
    else if (activeTab === 'LastNameForm')
      comp = (
        <LastNameForm
          setLastName={setLastName}
          setActiveTab={setActiveTab}
          setFirstName={setFirstName}
          setNickName={setNickName}
          type={type}
        />
      );
    else if (activeTab === 'NickNameForm')
      comp = (
        <NickNameForm
          setActiveTab={setActiveTab}
          setFirstName={setFirstName}
          setNickName={setNickName}
          type={type}
        />
      );
    else if (activeTab === 'SunriseForm')
      comp = (
        <SunriseForm
          setActiveTab={setActiveTab}
          setSunrise={setSunrise}
          setLastName={setLastName}
          type={type}
        />
      );
    else if (activeTab === 'SunsetForm')
      comp = (
        <SunsetForm
          setActiveTab={setActiveTab}
          setSunset={setSunset}
          type={type}
        />
      );
    else if (activeTab === 'ConfirmCard')
      comp = (
        <ConfirmCard
          setActiveTab={setActiveTab}
          firstName={firstName}
          nickName={nickName}
          lastName={lastName}
          sunrise={sunrise}
          type={type}
        />
      );

    return <div>{comp}</div>;
  };

  return (
    <div style={{ backgroundColor: '#f3e7b1', height: '100%' }}>
      <FormInfoBox
        firstName={firstName}
        nickName={nickName}
        lastName={lastName}
        sunrise={sunrise}
        sunset={sunset}
      />
      <MainPage activeTab={activeTab} />
    </div>
  );
}

const FormInfoBox = ({ firstName, lastName, nickName, sunrise, sunset }) => {
  function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  }

  let formattedDate = formatDate(sunrise);
  let formattedSunset = formatDate(sunset);

  return (
    <Row
      justify="center"
      style={{
        visibility: firstName || nickName ? 'visible' : 'hidden',
        paddingTop: '1rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      <Col span={24}>
        <Card
          style={{
            background: '#5b1f40',
            border: 'none',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <Row justify="center" align="middle" style={{ gap: '.5rem' }}>
            <Col>
              <Title level={3} style={{ color: '#f3e7b1' }}>
                {firstName}
              </Title>
            </Col>
            {nickName && (
              <Col>
                <Title level={3} style={{ color: '#f3e7b1' }}>
                  {nickName}
                </Title>
              </Col>
            )}
            <Col>
              <Title level={3} style={{ color: '#f3e7b1' }}>
                {lastName}
              </Title>
            </Col>
          </Row>
          {sunrise && (
            <Row justify="center" align="middle">
              <Col>
                <Title level={3} style={{ color: '#f3e7b1' }}>
                  Sunrise:
                </Title>
              </Col>
              <Col>
                <Title level={3} style={{ color: '#f3e7b1' }}>
                  {formattedDate}
                </Title>
              </Col>
            </Row>
          )}
          {sunset && (
            <Row justify="center" align="middle" gutter={16}>
              <Col>
                <Title level={3} style={{ color: '#fff' }}>
                  Sunset:
                </Title>
              </Col>
              <Col>
                <Title level={3} style={{ color: '#fff' }}>
                  {formattedSunset}
                </Title>
              </Col>
            </Row>
          )}
        </Card>
      </Col>
    </Row>
  );
};

const NameForm = ({ setActiveTab, setFirstName, setNickName, type }) => {
  const [value, setValue] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const onChange = (event) => {
    if (value === '') setShowError(true);
    else setShowError(false);
    setValue(event.target.value);
  };

  const checkValidFirstName = () => {
    if (value === '') return setShowError(true);
    setActiveTab('NickNameForm');
    setFirstName(value);
  };

  const checkValidNickName = () => {
    if (value === '') return setShowError(true);
    setActiveTab('FirstNameForm');
    setNickName(value);
  };

  const goToHome = () => {
    navigate('/');
  };

  const getHeadingText = () => {
    switch (type) {
      case 'self':
        return 'What does the family call you?';
      case 'smithparent':
        return 'What does the family call your Smith side parent?';
      case 'parent':
        return 'What does the family call your parent?';
      case 'spouse':
        return 'What does the family call your spouse?';
      case 'child':
        return 'What does the family call your child?';
      default:
        return 'Does the profile exist?';
    }
  };

  return (
    <Row
      justify="center"
      align="start"
      style={{ padding: '1rem', backgroundColor: '#f3e7b1' }}
    >
      <Col span={24} style={{ backgroundColor: 'transparent' }}>
        <Card
          style={{
            padding: '24px',
            backgroundColor: '#5b1f40',
            border: 'none',
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
            {getHeadingText()}
          </Title>
          <Row justify="center" style={{ marginBottom: '16px' }}>
            <Col>
              <Input
                onChange={onChange}
                placeholder="Enter your name"
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
                onClick={checkValidFirstName}
                style={{
                  color: '#873D62',
                  background: '#F7DC92',
                  border: 'solid #EABEA9',
                  fontWeight: 'bold',
                }}
              >
                First name?
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={checkValidNickName}
                style={{
                  color: '#873D62',
                  background: '#F7DC92',
                  border: 'solid #EABEA9',
                  fontWeight: 'bold',
                }}
              >
                Nickname?
              </Button>
            </Col>
          </Row>
          <Row justify="center" style={{ paddingTop: '3rem' }}>
            <Button
              style={{
                background: 'none',
                border: 'solid #EABEA9',
                color: '#F7DC92',
                fontWeight: 'bold',
              }}
              onClick={goToHome}
            >
              Back
            </Button>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

const FirstNameForm = ({ setNickName, setActiveTab, setFirstName, type }) => {
  const [value, setValue] = useState('');
  const [showError, setShowError] = useState(false);

  const onChange = (event) => {
    if (value === '') setShowError(true);
    else setShowError(false);
    setValue(event.target.value);
  };

  const checkValidFirstName = () => {
    if (value === '') return setShowError(true);
    setActiveTab('LastNameForm');
    setFirstName(value);
  };

  const getHeadingText = () => {
    if (type === 'self') return 'What is your first name?';
    else return 'What is their first name?';
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
            {getHeadingText()}
          </Title>
          <Row justify="center" style={{ marginBottom: '16px' }}>
            <Col>
              <Input
                onChange={onChange}
                placeholder="First Name"
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
                onClick={checkValidFirstName}
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
          <Row justify="center" style={{ marginTop: '3rem' }}>
            <Button
              style={{
                background: 'none',
                border: 'solid #EABEA9',
                color: '#F7DC92',
                fontWeight: 'bold',
              }}
              onClick={() => {
                setNickName('');
                setActiveTab('NameForm');
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

const NickNameForm = ({ setNickName, setActiveTab, setFirstName, type }) => {
  const [value, setValue] = useState('');
  const [showError, setShowError] = useState(false);

  const onChange = (event) => {
    if (value === '') setShowError(true);
    else setShowError(false);
    setValue(event.target.value);
  };

  const noNickName = () => {
    setActiveTab('LastNameForm');
  };

  const checkValidNickName = () => {
    if (value === '') return setShowError(true);
    setActiveTab('LastNameForm');
    setNickName(value);
  };

  const getHeadingText = () => {
    if (type === 'self') return 'Do you have a nickname?';
    else return 'Do they have a nickname?';
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
            {getHeadingText()}
          </Title>
          <Row justify="center" style={{ marginBottom: '16px' }}>
            <Col>
              <Input
                onChange={onChange}
                placeholder="Nickname"
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
                onClick={noNickName}
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
                onClick={checkValidNickName}
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
          <Row justify="center" style={{ marginTop: '3rem' }}>
            <Button
              onClick={() => {
                setFirstName('');
                setActiveTab('NameForm');
              }}
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
      </Col>
    </Row>
  );
};

const LastNameForm = ({
  setLastName,
  setActiveTab,
  setFirstName,
  setNickName,
  type,
}) => {
  const [value, setValue] = useState('');
  const [showError, setShowError] = useState(false);

  const onChange = (event) => {
    if (value === '') setShowError(true);
    else setShowError(false);
    setValue(event.target.value);
  };

  const checkValidLastName = () => {
    if (value === '') return setShowError(true);
    setActiveTab('SunriseForm');
    setLastName(value);
  };

  const getHeadingText = () => {
    if (type === 'self') return 'What is your last name?';
    else return 'What is their last name?';
  };

  return (
    <Row
      justify="center"
      align="start"
      style={{ padding: '1rem', backgroundColor: '#f3e7b1' }}
    >
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
            {getHeadingText()}
          </Title>
          <Row justify="center" style={{ marginBottom: '16px' }}>
            <Col>
              <Input
                onChange={onChange}
                placeholder="Last name"
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
                onClick={checkValidLastName}
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
          <Row justify="center" style={{ paddingTop: '3rem' }}>
            <Button
              onClick={() => {
                setFirstName('');
                setNickName('');
                setActiveTab('NameForm');
              }}
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
      </Col>
    </Row>
  );
};

const SunriseForm = ({ setLastName, setActiveTab, setSunrise, type }) => {
  const [value, setValue] = useState('');
  const [showError, setShowError] = useState(false);

  const onChange = (date) => {
    setValue(date.$d);
  };

  const checkValid = () => {
    if (value === '') return setShowError(true);
    setActiveTab('ConfirmCard');
    setSunrise(value);
  };

  const getHeadingText = () => {
    if (type === 'self') return 'When is your birthday?';
    else return 'When is their birthday?';
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
            {getHeadingText()}
          </Title>
          <Row justify="center" style={{ marginBottom: '16px' }}>
            <Col>
              <DatePicker
                format="MM/DD/YY"
                onChange={onChange}
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
                onClick={checkValid}
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
          <Row justify="center" style={{ marginTop: '3rem' }}>
            <Button
              style={{
                background: 'none',
                border: 'solid #EABEA9',
                color: '#F7DC92',
                fontWeight: 'bold',
              }}
              onClick={() => {
                setLastName('');
                setActiveTab('LastNameForm');
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

const SunsetForm = ({ setActiveTab, setSunset }) => {
  const [value, setValue] = useState('');
  const [showError, setShowError] = useState(false);
  const { Title, Text } = Typography;

  const onChange = (event) => {
    const nextValue = event.value;
    setValue(nextValue);
  };

  const checkValid = () => {
    if (value === '') return setShowError(true);
    setActiveTab('ConfirmCard');
    setSunset(value);
  };

  const goToConfirm = () => {
    setActiveTab('ConfirmCard');
  };

  return (
    <Row justify="center" align="middle" style={{ background: '#f0f2f5' }}>
      <Col>
        <Card
          style={{
            borderRadius: '8px',
            padding: '24px',
            background: '#fafafa',
          }}
        >
          <Title level={3} style={{ textAlign: 'center' }}>
            Have they passed away?
          </Title>
          <Row justify="center" style={{ marginBottom: '16px' }}>
            <DatePicker format="MM/DD/YY" value={value} onChange={onChange} />
          </Row>
          {showError && (
            <Text type="danger" strong>
              Required
            </Text>
          )}
          <Row justify="center" gutter={16} style={{ marginTop: '16px' }}>
            <Col>
              <Button shape="round" onClick={goToConfirm}>
                No
              </Button>
            </Col>
            <Col>
              <Button type="primary" shape="round" onClick={checkValid}>
                Submit
              </Button>
            </Col>
          </Row>
          <Row justify="center" style={{ marginTop: '24px' }}>
            <Button
              type="link"
              onClick={() => {
                setValue('');
                setShowError(false);
              }}
            >
              <Text strong>Back</Text>
            </Button>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

const ConfirmCard = ({
  setActiveTab,
  firstName,
  nickName,
  lastName,
  sunrise,
}) => {
  const navigate = useNavigate();
  const { session } = AuthConsumer();
  const userId = session?.user.id;

  function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  }

  let formattedDate = formatDate(sunrise);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('profile')
      .update({
        firstname: firstName,
        nickname: nickName,
        lastname: lastName,
        sunrise,
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      console.log('navigate to profile');
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ background: '#f3e7b1', padding: '1rem' }}
    >
      <Col span={24}>
        <Card
          style={{
            background: '#5b1f40',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
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
            Is this information Correct?
          </Title>
          <Row justify="start" gutter={16}>
            <Col>
              <Text
                style={{
                  color: '#f3e7b1',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                First Name:
              </Text>
            </Col>
            <Col>
              <Text
                style={{
                  color: '#f3e7b1',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                {firstName}
              </Text>
            </Col>
          </Row>
          {nickName && (
            <Row justify="start" gutter={16}>
              <Col>
                <Text
                  style={{
                    color: '#f3e7b1',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  Nickname:
                </Text>
              </Col>
              <Col>
                <Text
                  style={{
                    color: '#f3e7b1',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  {nickName}
                </Text>
              </Col>
            </Row>
          )}
          <Row justify="start" gutter={16}>
            <Col>
              <Text
                style={{
                  color: '#f3e7b1',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                Last Name:
              </Text>
            </Col>
            <Col>
              <Text
                style={{
                  color: '#f3e7b1',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                {lastName}
              </Text>
            </Col>
          </Row>
          <Row justify="start" gutter={16}>
            <Col>
              <Text
                style={{
                  color: '#f3e7b1',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                Birthday:
              </Text>
            </Col>
            <Col>
              <Text
                strong
                style={{
                  color: '#f3e7b1',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                {formattedDate}
              </Text>
            </Col>
          </Row>
          <Row justify="center" style={{ marginTop: '16px' }}>
            <Button
              style={{
                color: '#873D62',
                background: '#F7DC92',
                border: 'solid #EABEA9',
                fontWeight: 'bold',
              }}
              onClick={handleUpdate}
            >
              Create profile
            </Button>
          </Row>
          <Row justify="center" style={{ marginTop: '24px' }}>
            <Button
              style={{
                background: 'none',
                border: 'solid #EABEA9',
                color: '#F7DC92',
                fontWeight: 'bold',
              }}
              onClick={() => setActiveTab('SunriseForm')}
            >
              Back
            </Button>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfileForm;
