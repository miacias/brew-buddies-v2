import { Layout, Menu, Avatar } from 'antd';
import { useUserContext } from '../components/UserProvider';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import Icon, { HomeFilled } from '@ant-design/icons';
import { ReactComponent as BeerMugIcon } from './beerMug.svg';


const { Sider } = Layout;


// contains side-view, hamburger button, and menu options
function Sidebar() {
    const userData = useUserContext();

    // navbar menu items
  const items = [
    {
      key: "/",
      label: <Link to="/">Home</Link>,
      icon: <HomeFilled />
    },
    {
      key: "/breweries",
      label: <Link to="/breweries">Breweries</Link>,
      icon: <Icon component={BeerMugIcon} />
    },
    ...Auth.loggedIn() ? 
      [
        {
        key: "/profile",
        label: <Link to="/profile">Profile Page</Link>,
        icon: <Avatar src={userData?.profilePic}/>
        },
        {
          key: "4",
          label: <Link to="/" onClick={() => Auth.logout()}>Logout</Link>,
        }
      ] : [
        {
          key: "/signup",
          label: <Link to="/signup">Sign Up</Link>,
        },
        {
          key: "/connect",
          label: <Link to="/connect">Login</Link>,
        }
      ],
  ]

    return (
        <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
            // console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
            // console.log(collapsed, type);
        }}
        >
        <div className="logo" />
        {/* <Space direction='vertical'> */}
            <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={window.location.pathname} // highlights based on when pathname matches item key
            items={items}
            />
        </Sider>
    )
};

export default Sidebar;