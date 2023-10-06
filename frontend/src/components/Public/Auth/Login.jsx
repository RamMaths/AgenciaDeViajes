//modules
import axios from 'axios';

//bootstrap components
import { Container } from 'react-bootstrap';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//React components
import { useState } from 'react';

//my components
import { useGlobalContext } from '../../../App';
import DangerAlert from '../../DangerAlert';

const Login = () => {

  const [form, setForm] = useState({
    email: '',
    contrasena: ''
  });
  const { error, setError, user, setUser} = useGlobalContext();

  let sent = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({...error, show: false});

    setForm(form => {
      const newForm = {};

      for(const [key, value] of Object.entries(form)) {
        newForm[key] = value.trim();
      }

      if(!sent) {
        axios({
          method: 'post',
          url: `http://${import.meta.env.VITE_HOST}:3000/api/users/login`,
          data: newForm
        }).then(res => {
          setUser(res.data.data);
        }, err => {
          console.error(err);
          setError({
            show: true,
            message: err.response.data.message
          });
        });
      }

      sent = true;
      return newForm;
    });
  };

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  return (
    <Container className='mt-5'>
      {error.show && <DangerAlert/>}
      <Form className='' onSubmit={handleSubmit}>
        <Container>
          <Row className='row row-cols-1'>
            <Col>
              <Form.Group className='mb-3' controlId='emailField'>
                <Form.Label>
                  Correo electrónico
                </Form.Label>
                <Form.Control type='email' name='email' onChange={handleChange} placeholder='nombre@ejemplo.com'></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className='mb-3' controlId='contrasenaField'>
                <Form.Label>
                  Contraseña
                </Form.Label>
                <Form.Control type='password' name='contrasena' onChange={handleChange} placeholder='Contraseña'></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className='row row-cols-1 mt-3'>
            <Col className='p-3 d-flex justify-content-center align-items-center'>
              <Button type='submit'>Iniciar sesión</Button>
            </Col>
            <Col className='pt-3 d-flex justify-content-center align-items-center text-center align-middle'>
              <span>¿No tienes una cuenta? Crea una <Link className='nav-link text-primary' to='/signup'><u>aquí</u></Link></span>
            </Col>
          </Row>
      </Container>
      </Form>
    </Container>
  );
};

export default Login;
