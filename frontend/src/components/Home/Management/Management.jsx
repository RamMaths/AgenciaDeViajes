import axios from 'axios';
import Cookies from 'js-cookie';

//react components
import { 
  useEffect,
  useState,
  useContext,
  createContext
} from 'react';

// bootstrap components
import { 
  Table,
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal
} from 'react-bootstrap';

const tableLinks = {
  'Ninguna': null,
  'Paises': [
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/countries`,
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/countries/datatypes`
  ]
};

const ManagementContext = createContext();
export const useManagementContext = () => useContext(ManagementContext);

const Management = () => {
  const [tableName, setTableName] = useState('Ninguna');
  const [tableData, setTableData] = useState(null);

  const handleTableChange = (e) => {
    setTableName(e.target.value);
    if(e.target.value == 'Ninguna') return;
    fetchInfo(tableLinks[e.target.value][0], setTableData);
  };

  const fetchInfo = async (link, hook) => {
    axios({
      method: 'get',
      url: link,
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    }).then(res => {
      hook(res.data.data);
    }, err => {
      console.log(err);
    });
  };

  return (
    <ManagementContext.Provider value={{
      handleTableChange,
      tableLinks, 
      tableName, 
      setTableName, 
      tableData, 
      setTableData,
      fetchInfo
    }}>
      <Container>
        <MiniForm/>
        { tableName != 'Ninguna' && tableData && <Result table={tableData}/> }
      </Container>
    </ManagementContext.Provider>
  );
};

const AgregarModal = ({showAgregar, setShowAgregar}) => {
  const handleClose = () => {
    setShowAgregar(false);
  }

  const {
    tableLinks, 
    tableName, 
    fetchInfo,
    tableData
  } = useManagementContext();

  const [tableDataTypes, setTableDataTypes] = useState(null);

  let search = true;

  useEffect(() => { 
    if(tableLinks && tableName && showAgregar && search) {
      fetchInfo(tableLinks[tableName][1], setTableDataTypes);
      search = false;
    }
  }, [showAgregar]);


  const fieldTypes = {
    'integer': 'number',
    'numeric':  'number',
    'character varying': 'text',
    'date': 'date',
  };

  return (
    <Modal show={showAgregar} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agrega registros</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {tableDataTypes && 
        <Form>
          <Form.Group className='m-3' controlId={`${tableName}`}>
            <Row>
              {Object.keys(tableData[0]).map((field, i) => (
                <>
                  <Form.Label>
                    {field}
                  </Form.Label>
                  <Form.Control type={fieldTypes[tableDataTypes[i].data_type]} ></Form.Control>
                  {console.log(fieldTypes[tableDataTypes[i].data_type], i)}
                </>
              ))}
            </Row>
          </Form.Group>
        </Form>
        }
      </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
    </Modal>
  );
};

const MiniForm = () => {
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

const Result = ({table}) => {

  return (
    <Container>
      <Table className='shadow-sm' responsive={window.innerWidth <= 750} striped bordered hover>
        <thead>
          <tr>
            {table && Object.keys(table[0]).map(field => {
              return <th key={field}>{field}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {table && table.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map(value => (
                <td key={value}>{value}</td>
              ))}
              <td>hello</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Management;
