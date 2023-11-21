import Cookies from 'js-cookie';

//bootstrap
import { 
  Button,
  Form,
  Row,
  Col,
  Modal,
  Container
} from 'react-bootstrap';

//context
import { useGlobalContext } from '../../../../../App';
import { useCityContext } from './CitiesTable';
import { useManagementContext } from '../../Management';

//my components
import DangerAlert from '../../../../DangerAlert';

//utils
import { postRequest } from '../../../../utils/Utils';

const AddCity = ({show, handleClose}) => {
  const {
    error,
    setError
  } = useGlobalContext();

  const {
    tableLinks
  } = useManagementContext();

  const {
    states,
    state,
    handleRefresh
  } = useCityContext();

  const handleSubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formObj = Object.fromEntries(formData.entries());

    console.log(formObj.nombre, states[state]);

    postRequest(
      tableLinks['Ciudades'][0],
      {
        nombre: formObj.nombre,
        id_estado: states[state]
      },
      res => {
        handleClose();
        handleRefresh();
      },
      err => {
        console.error(err)
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    )
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Agrega registros</Modal.Title>
      </Modal.Header>
      <Modal.Body className='mt-0' style={{marginTop: '0'}}>
        {error.show && <DangerAlert/>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className='m-3 mb-4'>
            <Row>
              <Form.Label className='ps-0'>Nombre de la ciudad</Form.Label>
              <Form.Control name='nombre' type='text'>
              </Form.Control>
            </Row>
          </Form.Group>
          <Row>
            <Col>
              <Button className='w-100'variant='secondary' onClick={handleClose}>
                Cerrar
              </Button>
            </Col>
            <Col>
              <Button className='w-100' type='submit'>
                Crear registro
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  )
};

export default AddCity;
