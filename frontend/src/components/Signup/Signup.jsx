//bootstrap components
import { Container } from 'react-bootstrap';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//React components
import { useState } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    //cleaning the inputs
    setForm(form => {
      const newForm = {};
      for(const [key, value] of Object.entries(form)) {
        newForm[key] = value.trim();
      }
      console.log(newForm);
      return newForm;
    });
  };

  const handleChange = (e) => {
    if(e.target.name == 'telefono' && `${e.target.value}`.length > 10) return;

    setForm({...form, [e.target.name]: e.target.value});
  };

  return (
    <Container className='mt-5'>
      <Form className='' onSubmit={handleSubmit}>
        <Container>
          <Row>
            <Col>
              <Form.Group className='mb-3' controlId='nombreField'>
                <Form.Label>
                  Nombre
                </Form.Label>
                <Form.Control type='text' name='nombre' onChange={handleChange}></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className='mb-3' controlId='paternoField'>
                <Form.Label>
                  Apellido Paterno
                </Form.Label>
                <Form.Control type='text' name='paterno' onChange={handleChange}></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className='mb-3' controlId='maternoField'>
                <Form.Label>
                  Apellido Materno
                </Form.Label>
                <Form.Control type='text' name='materno' onChange={handleChange}></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className='mb-3' controlId='fechaNacField'>
                <Form.Label>
                  Fecha de Nacimiento
                </Form.Label>
                <Form.Control type='date' name='fecha_nac' onChange={handleChange}></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className='mb-3' controlId='emailField'>
                <Form.Label>
                  Correo electrónico
                </Form.Label>
                <Form.Control type='email' name='email' onChange={handleChange} placeholder='nombre@ejemplo.com'></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className='mb-3' controlId='contrasenaField'>
                <Form.Label>
                  Contraseña
                </Form.Label>
                <Form.Control type='password' name='contrasena' onChange={handleChange} placeholder='Contraseña'></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className='mb-3' controlId='telefonoField'>
                <Form.Label>
                  Telefono
                </Form.Label>
                <Form.Control type='number' name='telefono' maxLength="10" onChange={handleChange}></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col className='p-3 d-flex justify-content-center align-items-center'>
              <Button type='submit'>Crear cuenta</Button>
            </Col>
          </Row>

          <Row>
            <Col className='pt-3 d-flex justify-content-center align-items-center'>
              <span>¿Ya tienes una cuenta? Inicia sesión<Link className='nav-link text-primary' to='/login'><u>aquí</u></Link></span>
            </Col>
          </Row>
      </Container>
      </Form>
    </Container>
  );
};

export default Signup;
