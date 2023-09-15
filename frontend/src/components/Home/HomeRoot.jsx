//router components
import { Outlet } from 'react-router-dom';

//my components
import NavBar from './Navbar/Navbar';

const HomeRoot = () => {
  return (
    <>
      <NavBar/>
      <Outlet/>
    </>
  );
};

export default HomeRoot;
