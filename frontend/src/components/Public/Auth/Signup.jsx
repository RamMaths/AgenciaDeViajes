//modules
import axios from 'axios';

//bootstrap components
import { Container } from 'react-bootstrap';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//React components
import { createContext, useContext, useState } from 'react';

//my components
import { useGlobalContext } from '../../../App';
import DangerAlert from '../../DangerAlert';

import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    nombre: '',
    paterno: '',
    materno: '',
    fecha_nac: '',
    email: '',
    contrasena: '',
    telefono: ''
  });

  const { error, setError } = useGlobalContext();

  const navigate = useNavigate();

  let sent = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    //cleaning the inputs
    setError({...error, show: false});

    const formData = new FormData(e.currentTarget);
    const formObj = Object.fromEntries(formData.entries());

    for(const [key, value] of Object.entries(formObj)) {
      formObj[key] = value.trim();
    }
    
    if(!sent) {
      axios({
        method: 'post',
        url: 'http://localhost:3000/api/clientes/signup',
        data: formObj
      }).then(res => {
        window.location.replace('/login');
      }, err => {
        console.error(err);
        setError({
          show: true,
          message: err.response.data.message
        });
      });
    }

    sent = true;
  };

  return (
    <Container className='mt-5 mb-5'>
      {error.show && <DangerAlert/>}
      <Form className='' onSubmit={handleSubmit}>
        <Container>
          <Row className='row row-cols-1 row-cols-md-2'>
            <Col>
              <Form.Group className='mb-3' controlId='nombreField'>
                <Form.Label>
                  Nombre
                </Form.Label>
                <Form.Control type='text' name='nombre' ></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-3' controlId='paternoField'>
                <Form.Label>
                  Apellido Paterno
                </Form.Label>
                <Form.Control type='text' name='paterno' ></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-3' controlId='maternoField'>
                <Form.Label>
                  Apellido Materno
                </Form.Label>
                <Form.Control type='text' name='materno' placeholder='Opcional'></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-3' controlId='fechaNacField'>
                <Form.Label>
                  Fecha de Nacimiento
                </Form.Label>
                <Form.Control type='date' name='fecha_nac' ></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-3' controlId='emailField'>
                <Form.Label>
                  Correo electrónico
                </Form.Label>
                <Form.Control type='email' name='email' placeholder='nombre@ejemplo.com'></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-3' controlId='contrasenaField'>
                <Form.Label>
                  Contraseña
                </Form.Label>
                <Form.Control type='password' name='contrasena' placeholder='Contraseña'></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-3' controlId='telefonoField'>
                <Form.Label>
                  Telefono
                </Form.Label>
                <Form.Control type='number' name='telefono' maxLength='10' placeholder='10 Digitos'></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className='row row-cols-1 mt-3'>
            <Col className='d-flex justify-content-center align-items-center'>
              <Button type='submit'>Crear cuenta</Button>
            </Col>
            <Col className='d-flex justify-content-center text-center align-middle mt-3'>
              <span className=''>¿Ya tienes una cuenta? Inicia sesión<Link className='nav-link text-primary' to='/login'><u>aquí</u></Link></span>
            </Col>
          </Row>
        </Container>
      </Form>
    </Container>
  );
};

export default Signup;
