//router components
import { Outlet } from 'react-router-dom';

//my components
import NavBar from './Navbar/Navbar';
import Home from './Home';
import Navbar from './Footer/Footer';

const HomeRoot = () => {

  return (
    <>
      <NavBar/>
      { window.location.pathname === '/home' && <Home/> }
      <Outlet/>
      <Navbar/>
    </>
  );
};

export default HomeRoot;
