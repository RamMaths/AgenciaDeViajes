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
import { 
  getRequest,
  postRequest
} from '../../utils/Utils';

const fetchAndSet = async (url, hook) => {
  getRequest(
    url,
    {
      'Authorization': `Bearer ${Cookies.get('jwt')}`
    },
    (res) => {
      const newObj = {};
      res.data.data.map(el => {
        newObj[el.column_name] = el.data_type;
      });
      hook(newObj);
    },
    (err) => {
      console.log(err);
    }
  );
};

const fieldTypes = {
  'integer': 'number',
  'numeric':  'text',
  'character varying': 'text',
  'date': 'date',
};

const handleSubmit = () => {
  e.preventDefault();
  //cleaning the inputs
  setError({...error, show: false});

  const formData = new FormData(e.currentTarget);
  const formObj = Object.fromEntries(formData.entries());

  for(const [key, value] of Object.entries(formObj)) {
    formObj[key] = value.trim();
  }

  console.log(formObj);

  // postRequest(

  // );
};

const AgregarModal = ({showAgregar, setShowAgregar}) => {
  const handleClose = () => {
    setShowAgregar(false);
  }

  const {
    tableLinks, 
    tableName, 
    tableData
  } = useManagementContext();

  const [tableDataTypes, setTableDataTypes] = useState(null);

  let search = true;

  useEffect(() => { 
    if(tableLinks && tableName && showAgregar && search) {
      fetchAndSet(tableLinks[tableName][1], setTableDataTypes);
      search = false;
    }
  }, [showAgregar]);

  return (
    <Modal show={showAgregar} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agrega registros</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {tableDataTypes && 
        <Form onSubmit={handleSubmit}>
          <Form.Group className='m-3 mb-4' controlId={`${tableName}`}>
            <Row>
              {Object.keys(tableData[0]).map((field, i) => { 
                return !field.startsWith('id') && (
                <div className='mt-2'key={field}>
                  <Form.Label>{field}</Form.Label>
                  <Form.Control name={field} type={fieldTypes[tableDataTypes[field]]} ></Form.Control>
                </div>)
            })}
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
