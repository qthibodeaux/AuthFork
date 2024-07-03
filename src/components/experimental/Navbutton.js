import { useState } from "react";
import { Button, FloatButton } from "antd"
import { HomeOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';

function Navbutton() {
    const profile = {
        firstname: "Jessica",
        lastname: "Thibodeaux",
        nickname: "Thibodeaux"
    }

    if (!profile) return <FloatButton description="Join Us" shape="square" style={{ right: 24 }}  />
    else if (!profile.firstname){
        return (
            <FloatButton.Group
                trigger="click"
                style={{
                    right: 24,
                }}
                icon={<MenuOutlined />}
                shape="square"
            >
                <FloatButton shape="square" icon={<HomeOutlined />}/>
                <FloatButton shape="square" icon={<UserOutlined />}/>
                <FloatButton shape="square" icon={<LogoutOutlined />}/>
            </FloatButton.Group>
        )
    } else {
        const firstInitial = profile.firstname[0] || '';
        const lastInitial = profile.lastname ? profile.lastname[0] : '';
        let initials = firstInitial+lastInitial
          
        return (
            <FloatButton.Group
                trigger="click"
                style={{
                    right: 24,
                }}
                icon={<MenuOutlined />}
                shape="square"
            >
                <FloatButton shape="square" icon={<HomeOutlined />}/>
                <FloatButton shape="square" description={initials}/>
                <FloatButton shape="square" icon={<LogoutOutlined />}/>
            </FloatButton.Group>
        )
    }
  
}

const MenuButton = () => {
    const profile = true
  
    return (
      <div>
        {!profile 
          ? <Button style={{ color: '#873D62', background: '#F7DC92', border: 'solid #EABEA9', fontWeight: 'bold'}} >Join Us</Button>
          : (
            <FloatButton.Group
                trigger="hover"
                icon={<MenuOutlined />}
                shape="square"
                style={{
                    right: 24,
                    backgroundColor: '#F7DC92',
                    color: '#873D62'
                }}
            >
                
            </FloatButton.Group>
          )
        }
      </div>
    )
  }
  
  const AvatarButton = () => {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [initials, setInitials] = useState('');
  
    const profile = {
      firstname: null,
      lastname: null,
      avatar_url: null
    }
  
    return (
      <div>
        {avatarUrl 
          ? "true"
          : profile.firstname 
            ? "true"
            : "false"
        }
      </div>
    )
  }
  
  const AvatarMenu = () => {
  
  }

export default Navbutton