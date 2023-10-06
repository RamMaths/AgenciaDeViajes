//router components
import { 
  Outlet,
  useLocation
} from 'react-router-dom';

//my components
import NavBar from './Navbar/Navbar';
import Home from './Home';
import Footer from './Footer/Footer';


const HomeRoot = () => {

  const location = useLocation();

  return (
    <>
      <NavBar/>
      { location.pathname === '/home' && <Home/> }
      <Outlet/>
      <Footer/>
    </>
  );
};

export default HomeRoot;
