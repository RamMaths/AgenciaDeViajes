//bootstrap components
import { 
  Container,
  Nav,
  Navbar,
  Button
} from 'react-bootstrap';
import {
  Link,
  useNavigate
} from 'react-router-dom'


const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Navbar className='navbar bg-body-tertiary w-100' expand='lg' style={{boxShadow: '0 4px 8px -2px #bababa'}}>
      <Container>
        <Navbar.Brand href='/'>Agencia De Viajes</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Link className='ps-xs-3 nav-link text-center' to='/'>Inicio</Link>
            <Button className='btn-primary ms-3' onClick={() => navigate('/login')}>Inciar sesión</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
