//router
import { Outlet } from 'react-router-dom';

// components
import NavBar from './Navbar/Navbar';

const PublicRoot = () => {
  return (
    <>
      <NavBar/>
      <Outlet/>
    </>
  );
};

export default PublicRoot;
