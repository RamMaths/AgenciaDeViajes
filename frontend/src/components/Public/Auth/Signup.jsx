//bootstrap components
import { Container } from 'react-bootstrap';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//my components
import { useGlobalContext } from '../../../App';
import DangerAlert from '../../DangerAlert';
import { postRequest } from '../../utils/Utils';

const sexs = {
  'No binario': 1,
  'Femenino': 2,
  'Masculino': 3
};

console.log(import.meta.env.VITE_HOST);

const Signup = () => {
  const {
    error, 
    setError,
    serverError,
    setServerError
  } = useGlobalContext(false);

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

    formObj.id_sexo = sexs[formObj.id_sexo];

    console.log(formObj);
    if(!sent) {
      postRequest(
        `http://${import.meta.env.VITE_HOST}:3000/api/users/signup`,
        formObj,
        (res) => {
          window.location.replace('/login');
        },
        (err) => {
          if(`${err.response.status}`.startsWith('5')) {
            setServerError(true);
            return;
          }

          setError({
            show: true,
            message: err.response.data.message
          });
        }
      );
    }

    sent = true;
  };

  if(serverError) return Error('Error interno del servidor');

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
            <Col>
              <Form.Group className='mb-3' controlId='sexoField'>
                <Form.Label>
                  Sexo
                </Form.Label>
                <Form.Select name='id_sexo'>
                  {Object.keys(sexs).map(sex => (
                    <option key={sex}>{sex}</option>
                  ))}
                </Form.Select>
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
