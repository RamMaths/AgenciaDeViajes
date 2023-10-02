//react components
import {
  createContext,
  useContext,
  useState
} from 'react';

//bootstrap components
import {
  Navbar, 
  Offcanvas,
  Button,
  ListGroup,
} from 'react-bootstrap';

//my components
import SideMenu from './SideMenu';

const HomeNavContext = createContext();
export const useHomeNavContext = () => useContext(HomeNavContext);

const NavBar = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <HomeNavContext.Provider value={{ showMenu, setShowMenu }}>
      <Navbar className='navbar bg-body-tertiary' expand='lg' style={{boxShadow: '0px 4px 10px -2px #bababa'}}>
        <div className='d-flex justify-content-between align-items-center w-100'>
          <div className='d-flex justify-content-center align-items-center align-middle text-center'>
            <Button className='m-3 ms-md-5 bg-light border-light' onClick={() => setShowMenu(true)}>
              <i className="bi bi-list text-secondary fs-1"></i>
            </Button>
          </div>
          <div className='d-flex justify-content-center align-items-center align-middle text-center'>
            <Navbar.Brand className='m-3 me-md-5' >Agencia De Viajes</Navbar.Brand>
          </div>
        </div>
      </Navbar>
      <SideMenu/>
    </HomeNavContext.Provider>
  );
};

export default NavBar;
