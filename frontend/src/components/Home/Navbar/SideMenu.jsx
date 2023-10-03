//bootstrap components
import {
  Offcanvas,
  ListGroup,
} from 'react-bootstrap';

//context
import { useGlobalContext } from '../../../App';
import { useHomeNavContext } from './Navbar';

//router
import { useNavigate } from 'react-router-dom';

//my components

//css
import './SideMenu.css';

const SideMenu = () => {

  const { showMenu, setShowMenu } = useHomeNavContext();
  const { setUser } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogOut = () => {
    setUser(null);
  };

  return (
    <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} style={{transition: 'transform 0.5s ease-out'}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='d-flex justify-content-start align-items-center w-100 border-top border-bottom menu-list-item' onClick={() => navigate('/home')}>
            <ListGroup.Item className='mt-2 mb-2'>
              <span className='text-secondary text-start fs-5 align-middle p-1'><i className="bi bi-house me-3 fs-2"></i>Inicio</span>
            </ListGroup.Item>
          </div>

          <div className='d-flex justify-content-start align-items-center w-100 border-top border-bottom menu-list-item ' onClick={handleLogOut}>
            <ListGroup.Item className='mt-2 mb-2'>
              <span className='text-secondary text-start fs-5 align-middle p-1'><i className="bi bi-door-open me-3 fs-2"></i>Salir</span>
            </ListGroup.Item>
          </div>
        </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SideMenu;
