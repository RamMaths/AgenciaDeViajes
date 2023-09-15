//bootstrap components
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <Navbar className='navbar bg-body-tertiary' expand='lg'>
      <Container>
        <Navbar.Brand href='/'>Agencia De Viajes</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Link className='ps-xs-3 nav-link' to='/'>Inicio</Link>
            <Link className='ps-xs-3 nav-link' to='/login'>Log in</Link>
            <Link className='ps-xs-3 nav-link' to='/signup'>Sign up</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
