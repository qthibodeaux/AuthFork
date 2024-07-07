import { Layout } from "antd"

const { Header } = Layout;

function Navbar() {
  return (
    <Header 
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#873D62',
      }}>
        <div style={{ color: '#F7DC92', fontSize: '24px', fontWeight: 'bold' }} >Smith Family</div>
    </Header>
  )
}

export default Navbar