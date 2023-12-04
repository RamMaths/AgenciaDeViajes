import Cookies from 'js-cookie';

//context
import { useGlobalContext } from '../../../../../App';
import { useStateContext } from './StatesTable';
import { useManagementContext } from '../../Management';

//react
import { useState } from 'react';

//bootstrap
import { 
  Form,
  Modal,
  Row,
  Col,
  Button
} from 'react-bootstrap';

//my components
import DangerAlert from '../../../../DangerAlert';

//utils
import { patchRequest } from '../../../../utils/Utils';

const UpdateState = () => {
  const {
    error,
    setError
  } = useGlobalContext();

  const {
    tableLinks,
    setEditing
  } = useManagementContext();

  const {
    updateModal,
    setUpdateModal,
    updateField,
    countries,
    country,
    handleRefresh
  } = useStateContext();

  const [selection, setSelection] = useState(country);

  const handleClose = () => {
    setUpdateModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formObj = Object.fromEntries(formData.entries());

    let data;
    let field;
    let type;

    if(updateField.field === 'nombre') {
      data = formObj.nombre;
      field = 'nombre';
      type = 'character varying';
    } else {
      data = countries[formObj.pais];
      field = 'id_pais'
      type = 'integer';
    }

    patchRequest(
      tableLinks['Estados'][0],
      {
        field,
        value: data,
        id: updateField.id,
        type
      },
      res => {
        console.log(res.data.data);
        setEditing(false);
        handleClose();
        handleRefresh();
      },
      err => {
        console.error(err);
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    );
  };

  const handleCountryChange = (e) => {
    setSelection(e.target.value)
  };

  console.log(selection);

  return (
    <Modal show={updateModal} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Actualiza el campo</Modal.Title>
      </Modal.Header>
      <Modal.Body className='mt-0' style={{marginTop: '0'}}>
        {error.show && <DangerAlert/>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className='m-3 mb-4'>
            <Row>
              {
                updateField.field === 'nombre' && (
                  <>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control 
                      name='nombre'
                      type='text' 
                      defaultValue={updateField.value}
                    >
                    </Form.Control>
                  </>
                )
              }

              {
                updateField.field === 'pais' && (
                  <>
                    <Form.Group className='' controlId='tableField'>
                      { 
                        countries &&
                        <>
                          <Form.Label>
                            Pais
                          </Form.Label>
                          <Form.Select name='pais' onChange={handleCountryChange}>
                            {
                              Array.from(Object.entries(countries)).map(([pais, id]) => {
                                return <option key={id}>{pais}</option>
                              })
                            }
                          </Form.Select>
                        </>
                      }
                    </Form.Group>
                  </>
                )
              }
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
                Actualizar
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>

  );
};

export default UpdateState;
