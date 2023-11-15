import Cookies from 'js-cookie';

//react components
import { 
  useState,
  useEffect,
  useRef,
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
  deleteRequest,
  getRequest
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
    handleRefresh,
    dependentTable,
    dependentData
  } = useManagementContext();

  useEffect(() => {
    if(dependentTable) {
      for(const [table, fields] of Object.entries(tableLinks[tableName][tableLinks[tableName].length - 2])) {
        getRequest(
          `${tableLinks[table][0]}?fields=${fields.join(',')}`,
          res => {
            const newMap = new Map([]);
            res.data.data.forEach(row => {
              newMap.set(Object.values(row)[1], Object.values(row)[0]);
            });
            dependentData.current.set(table, newMap);
          },
          err => {
            console.error(err);
          },
          {
            'Authorization': `Bearer ${Cookies.get('jwt')}`
          }
        );
      }
    }
  }, [dependentTable])

  const {
    error,
    setError
  } = useGlobalContext();

  const [showAgregar, setShowAgregar] = useState(false);
  const [selectedDependentData, setSelectedDependentData] = useState({});

  const primaryKeys = useRef(new Map([]));

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

  const queryDependentTable = e => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formObj = Object.fromEntries(formData.entries());

    delete formObj['tabla'];

    const filters = {};

    for(const [key, value] of Object.entries(formObj)) {
      filters[tableLinks[key][2]] = dependentData.current.get(key).get(value);
    }

    console.log(filters);
  };

  console.log(dependentData);

  return (
    <div className='mt-3'>
      <AgregarModal showAgregar={showAgregar} setShowAgregar={setShowAgregar}/>
      <Row>
        <Col>
          <Form id='tables' className='' onSubmit={queryDependentTable}>
            <Form.Group className='' controlId='tableField'>
              <Form.Label>
                Tabla
              </Form.Label>
              <Form.Select name='tabla' onChange={handleTableChange}>
                { Object.keys(tableLinks).map(table => (
                  <option key={table}>{table}</option>
                ))}
              </Form.Select>
              {
                dependentTable && (
                  <>
                    {
                      Array.from(dependentData.current.entries()).map(([table, info]) => (
                        <div key={table}>
                          <Form.Label className='mt-2'>
                            {table}
                          </Form.Label>
                          <Form.Select name={table}>
                            {
                              Array.from(info.keys()).map(el => (
                                <option key={el}>{el}</option>
                              ))
                            }
                          </Form.Select>
                        </div>
                      ))
                    }
                  </>
                )
              }
            </Form.Group>
          </Form>
        </Col>
      </Row>

      { tableName != 'Ninguna' && tableData && (

      <Row>
        <Col>
          <div className='d-flex justify-content-start my-3'>
            {
              dependentTable && (
                <Button form='tables' type='submit'className='btn-secondary ms-3'>
                  <i className='bi bi-search fs-5'></i>
                </Button>
              )
            }

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
