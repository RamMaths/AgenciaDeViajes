//bootstrap components
import {
  Offcanvas,
  ListGroup,
} from 'react-bootstrap';

//context
import { useGlobalContext } from '../../../App';
import { useHomeNavContext } from './Navbar';

//my components

const SideMenu = () => {

  const { showMenu, setShowMenu } = useHomeNavContext();
  const { setUser } = useGlobalContext();

  const handleLogOut = () => {
    setUser(null);
  };

  return (
    <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} style={{transition: 'transform 0.5s ease-out'}}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='d-flex justify-content-start align-items-center w-100 border-top border-bottom' onClick={handleLogOut}>
            <ListGroup.Item className='mt-2 mb-2'>
              <span className='text-secondary fs-5 align-middle'><i className="bi bi-box-arrow-in-left me-3 fs-2"></i>Salir</span>
            </ListGroup.Item>
          </div>
        </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SideMenu;
