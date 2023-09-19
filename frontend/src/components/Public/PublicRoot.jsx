//router
import { 
  Outlet,
  useLocation 
} from 'react-router-dom';

// my components
import NavBar from './Navbar/Navbar';
import Content from './Content/Content';
import Footer from './Footer/Footer';

const PublicRoot = () => {
  const location = useLocation();

  return (
    <>
      <NavBar/>
      {location.pathname === '/' &&  <Content/>}
      <Outlet/>
      <Footer/>
    </>
  );
};

export default PublicRoot;
