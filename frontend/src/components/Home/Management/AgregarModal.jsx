import Cookies from 'js-cookie';

//react components
import { 
  useEffect,
  useState
} from 'react';
//bootstrap components
import { 
  Modal,
  Button,
  Form,
  Row,
  Col
} from 'react-bootstrap';
//my components
import { useManagementContext } from './Management';
import { useGlobalContext } from '../../../App';
import { 
  postRequest
} from '../../utils/Utils';
import DangerAlert from '../../DangerAlert';

const fieldTypes = {
  'integer': 'number',
  'numeric':  'number',
  'character varying': 'text',
  'date': 'date',
};

const AgregarModal = ({showAgregar, setShowAgregar}) => {
  let search = true;

  //contexts
  const {
    tableLinks, 
    tableName, 
    tableData,
    handleRefresh,
    empty,
    fetchAndSet,
    tableDataTypes,
    setTableDataTypes
  } = useManagementContext();
  const {
    error,
    setError
  } = useGlobalContext();

  //callbacks
  const handleClose = () => {
    setShowAgregar(false);
    setError(err => { return {...err, show: false}});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formObj = Object.fromEntries(formData.entries());

    for(const [key, value] of Object.entries(formObj)) {
      const inputElement = document.querySelector(`[name="${key}"]`);
      if (inputElement.type === 'number' && inputElement.step === 'any') {
        formObj[key] = parseFloat(value);
      } else if(inputElement.type === 'number') {
        formObj[key] = parseInt(value);
      } else {
        formObj[key] = value.trim();
      }
    }
    postRequest(
      tableLinks[tableName][0],
      formObj,
      (res) => {
        handleClose();
        handleRefresh();
      },
      (err) => {
        console.error(err);
        setError({
          show: true,
          message: err.response.data.message
        });
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    );

  };

  useEffect(() => { 
    if(tableLinks && tableName && showAgregar && search) {
      fetchAndSet(tableLinks[tableName][1], setTableDataTypes);
      search = false;
    }
  }, [showAgregar]);

  //component
  return (
    <Modal show={showAgregar} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Agrega registros</Modal.Title>
      </Modal.Header>
      <Modal.Body className='mt-0' style={{marginTop: '0'}}>
        {error.show && <DangerAlert/>}
        {tableDataTypes && 
        <Form onSubmit={handleSubmit}>
          <Form.Group className='m-3 mb-4' controlId={`${tableName}`}>
            <Row>
            {
              tableData && !empty && Object.keys(tableData[0]).map((field, i) => { 
                if(field.startsWith('id') && i === 0) return undefined;
                else {
                  return (
                    !field.startsWith('_') &&
                    <div className='mt-2'key={field}>
                      <Form.Label>{field}</Form.Label>
                      <Form.Control 
                        name={field} 
                        type={fieldTypes[tableDataTypes[field]]} 
                        step={tableDataTypes[field] === 'numeric' ? 'any' : undefined}
                      >
                      </Form.Control>
                    </div>
                  )
                }
              })
            }

            {
              tableData && empty && Object.values(tableData).map((field, i) => { 
                field = field.column_name;
                if(field.startsWith('id') && i === 0) return undefined;
                else {
                  return (
                    !field.startsWith('_') &&
                    <div className='mt-2'key={field}>
                      <Form.Label>{field}</Form.Label>
                      <Form.Control 
                        name={field} 
                        type={fieldTypes[tableDataTypes[field]]} 
                        step={tableDataTypes[field] === 'numeric' ? 'any' : undefined}
                      >
                      </Form.Control>
                    </div>
                  )
                }
              })
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
                Crear registro
              </Button>
            </Col>
          </Row>
        </Form>
        }
      </Modal.Body>
    </Modal>
  );
};

export default AgregarModal;
