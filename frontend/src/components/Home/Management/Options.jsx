//react components
import { useState } from 'react';

//bootstrap components
import { 
  Row,
  Col,
  Form,
  Button
} from 'react-bootstrap';

//my components
import AgregarModal from './AgregarModal';

//context
import { useManagementContext } from './Management';

const Options = () => {
  const {
    handleTableChange,
    tableLinks,
    tableName,
    tableData
  } = useManagementContext();

  const [showAgregar, setShowAgregar] = useState(false);

  const handleShowAgregar = () => {
    setShowAgregar(true);
  };

  return (
    <div className='mt-3'>
      <AgregarModal showAgregar={showAgregar} setShowAgregar={setShowAgregar}/>
      <Row>
        <Col>
          <Form className=''>
            <Form.Group className='' controlId='tableField'>
              <Form.Label>
                Tabla
              </Form.Label>
              <Form.Select name='tabla' onChange={handleTableChange}>
                { Object.keys(tableLinks).map(table => (
                  <option key={table}>{table}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      { tableName != 'Ninguna' && tableData && (
      <Row>
        <Col>
          <div className='d-flex justify-content-start my-3'>
            <Button onClick={handleShowAgregar}><i className='bi bi-file-earmark-plus fs-5 me-2'></i>Agregar</Button>
            <Button className='btn-secondary ms-3'><i className='bi bi-pencil-square fs-5 me-2'></i>Editar</Button>
            <Button className='btn-danger ms-3'><i className='bi bi-file-earmark-x  fs-5 me-2'></i>Eliminar</Button>
          </div>
        </Col>
      </Row>
      )}
    </div>
  );
};

export default Options;
