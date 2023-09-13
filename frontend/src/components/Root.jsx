import { Outlet } from 'react-router-dom';

import NavBar from './Navbar/Navbar';

const Root = () => {
  return (
    <>
      <NavBar/>
      <Outlet/>
    </>
  );
};

export default Root;
