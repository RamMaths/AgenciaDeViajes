import { 
  Modal,
  Button,
  Form,
  Row,
  Col
} from 'react-bootstrap';

const UpdateModal = () => {

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

export default UpdateModal;
