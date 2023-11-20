import Cookies from 'js-cookie';

//react components
import { 
  useState,
  useContext,
  createContext
} from 'react';

//bootstrap components
import { 
  Row,
  Col,
  Form,
  Button
} from 'react-bootstrap';

//my components
import AgregarModal from './AgregarModal';
import DangerAlert from '../../DangerAlert';

//utils
import { 
  deleteRequest
} from '../../utils/Utils';

//context
import { useManagementContext } from './Management';
import { useGlobalContext } from '../../../App';

const Options = () => {
  const {
    handleTableChange,
    tableLinks,
    tableName,
    tableData,
    editing,
    setEditing,
    deletions,
    handleRefresh
  } = useManagementContext();

  const {
    error,
    setError
  } = useGlobalContext();

  const [showAgregar, setShowAgregar] = useState(false);

  const handleShowAgregar = () => {
    setShowAgregar(true);
    setEditing(false);
  };

  const handleDeletion = () => {
    if (deletions.current.size <= 0) {
      //error
      setError({
        show: true,
        message: 'No has seleccionado ningún registro'
      });
    } else {

      let arr = [];

      for(let value of deletions.current.keys()) {
        arr.push(value);
      }

      deleteRequest(
        tableLinks[tableName][0],
        {
          arr
        },
        (res) => {
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
    }
  };

  const handleCancel = () => {
    setEditing(false);
    deletions.current.clear();
    setError({...error, show: false});
  };

  console.log();

  return (
    <div className='mt-3'>
      <AgregarModal showAgregar={showAgregar} setShowAgregar={setShowAgregar}/>
      <Row>
        <Col>
          <Form id='tables' className=''>
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

      { tableName != 'Ninguna' && tableData && !tableLinks[tableName][tableLinks[tableName].length - 1] && (

      <Row>
        <Col>
          <div className='d-flex justify-content-start my-3'>
            {
              !editing ? 
              <Button className='btn-secondary ms-3 me-3' onClick={() => setEditing(true)}>
                <i className='bi bi-pencil-square fs-5'></i>
              </Button> :
              <Button className='btn-danger d-flex justify-content-center align-items-center ms-3 me-3' onClick={handleCancel}>
                <i className='bi bi-x-lg fs-5'></i>
              </Button>
            }

            {editing && <Button className='btn-danger me-3'><i className='bi bi-file-earmark-x fs-5' onClick={handleDeletion}></i></Button>}
            {!editing && <Button className='me-3' onClick={handleShowAgregar}><i className='bi bi-file-earmark-plus fs-5'></i></Button>}
          </div>
        </Col>
      </Row>
      )}
      <div className='w-100'>
        {error.show && <DangerAlert/>}
      </div>
    </div>
  );
};

export default Options;
