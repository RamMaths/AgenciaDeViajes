// react-bootstrap
import { 
  Modal,
  Button,
  Form,
  Row,
  Col
} from 'react-bootstrap';

//react
import { useEffect } from 'react';

//context
import { useManagementContext } from './Management';

const fieldTypes = {
  'integer': 'number',
  'numeric':  'number',
  'character varying': 'text',
  'date': 'date',
};

const UpdateModal = ({showUpdate, setShowUpdate, updateField}) => {

  const {
    fetchAndSet,
    tableLinks,
    tableName,
    tableDataTypes,
    setTableDataTypes,
    handleRefresh
  } = useManagementContext();

  const handleClose = () => {
    setShowUpdate(false);
  };

  let search = true;

  useEffect(() => { 
    if(tableLinks && tableName && showUpdate && search) {
      fetchAndSet(tableLinks[tableName][1], setTableDataTypes);
      search = false;
    }
  }, [showUpdate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formObj = Object.fromEntries(formData.entries());

    const inputElement = document.querySelector(`[name="${updateField.field}"]`);

    if (inputElement.type === 'number' && inputElement.step === 'any') {
      formObj[updateField.field] = parseFloat(formObj[updateField.field]);
    } else if(inputElement.type === 'number') {
      formObj[updateField.field] = parseInt(formObj[updateField.field]);
    } else {
      formObj[updateField.field] = formObj[updateField.field].trim();
    }

    patchRequest(
      tableLinks[tableName][0],
      {
        field: updateField.field,
        value: formObj[updateField.field],
        id: updateField.id
      },
      (res) => {
        handleClose();
        handleRefresh();
      },
      (err) => {
        console.error(err);
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    );
  };

  return (
    <Modal show={showUpdate} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Actualiza el campo</Modal.Title>
      </Modal.Header>
      <Modal.Body className='mt-0' style={{marginTop: '0'}}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='m-3 mb-4' controlId={`${tableName}`}>
            <Row>
              {
                tableDataTypes && (
                  <>
                    <Form.Label>{updateField.field}</Form.Label>
                    <Form.Control 
                      name={updateField.field} 
                      type={fieldTypes[tableDataTypes[updateField.field]]} 
                      step={tableDataTypes[updateField.field] === 'numeric' ? 'any' : undefined}
                      defaultValue={updateField.value}
                    >
                    </Form.Control>
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

export default UpdateModal;
