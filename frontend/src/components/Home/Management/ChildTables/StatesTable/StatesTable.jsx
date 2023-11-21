//
import Cookies from 'js-cookie';

//bootstrap
import { 
  Row,
  Button,
  Col,
  Form,
  Table
} from 'react-bootstrap';

//react 
import { 
  useEffect,
  useState,
  createContext,
  useContext
} from 'react';

//utils
import { 
  getRequest,
  deleteRequest,
  postRequest
} from '../../../../utils/Utils';

//context
import { useManagementContext } from '../../Management';
import { useGlobalContext } from '../../../../../App';
const StateContext = createContext();
export const useStateContext = () => useContext(StateContext);

//my components
import Checkbox from '../Checkbox';
import AddState from './AddState';
import UpdateState from './UpdateState';

//css
import '../ChildTables.css';

const StatesTable = () => {
  const {
    editing,
    setEditing,
    deletions,
    tableLinks
  } = useManagementContext();

  const {
    error,
    setError
  } = useGlobalContext();

  const [countries, setCountries] = useState(null);
  const [country, setCountry] = useState(null);
  const [states, setStates] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateField, setUpdateField] = useState({});

  const handleCancel = () => {
    setEditing(false);
    deletions.current.clear();
    setError({...error, show: false});
  };

  const handleClose = () => {
    setAddModal(false);
    setError(err => { return {...err, show: false}});
  };

  const handleUpdate = (data) => {
    setUpdateField(data);
    setUpdateModal(true);
  };

  const handleRefresh = () => {
    if(country) {
      getRequest(
        `${tableLinks['Estados'][0]}?id_pais=${countries[country]}`,
        (res) => {
          setStates(res.data.data);
        },
        (err) => {
          console.error(err);
        },
        {
          'Authorization': `Bearer ${Cookies.get('jwt')}`
        }
      );
    }
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
        tableLinks['Estados'][0],
        {
          arr
        },
        (res) => {
          handleRefresh();
          setEditing(false);
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

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  useEffect(() => {
    getRequest(
      `${tableLinks['Paises'][0]}?fields=id_pais,nombre`,
      res => {
        let obj = {};
        res.data.data.forEach(el => {
          obj[el.nombre] = el.id_pais;
        });

        setCountries(obj);
        setCountry(res.data.data[0].nombre)
      },
      err => {
        console.error(err);
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    );
  }, []);

  useEffect(() => {
    if(country) {
      getRequest(
        `${tableLinks['Estados'][0]}?id_pais=${countries[country]}`,
        (res) => {
          setStates(res.data.data);
        },
        (err) => {
          console.error(err);
        },
        {
          'Authorization': `Bearer ${Cookies.get('jwt')}`
        }
      );
    }
  }, [country]);

  return (
    <StateContext.Provider value={
      {
        countries,
        country, 
        setCountry, 
        handleRefresh,
        updateModal,
        setUpdateModal,
        updateField
      }
    }>
      { addModal && <AddState handleClose={handleClose}/>}
      { updateModal && <UpdateState show={updateModal} ></UpdateState> }
      <Row>
        <Col>
          <Form id='paises' className='pt-3'>
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
          </Form>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className='d-flex justify-content-start my-3'>
            {
              !editing ? 
              <Button className='btn-secondary me-3' onClick={() => setEditing(true)}>
                <i className='bi bi-pencil-square fs-5'></i>
              </Button> :
              <Button className='btn-danger d-flex justify-content-center align-items-center ms-3 me-3' onClick={handleCancel}>
                <i className='bi bi-x-lg fs-5'></i>
              </Button>
            }

            {editing && <Button className='btn-danger me-3'><i className='bi bi-file-earmark-x fs-5' onClick={handleDeletion}></i></Button>}
            {!editing && <Button className='me-3' onClick={() => setAddModal(true)}><i className='bi bi-file-earmark-plus fs-5'></i></Button>}
          </div>
        </Col>
      </Row>

      <div>
        <Table className='shadow-sm' responsive={window.innerWidth <= 750} striped bordered hover>
          <thead>
            <tr className='align-middle text-center'>
              <th>Id</th>
              <th>Estado</th>
              <th>País</th>
            </tr>
          </thead>
          <tbody className='align-middle text-center'>
            {
              states && states.length > 0 && states.map((state, i) => {
                console.log(state);
                return (
                  <tr key={state.nombre}>
                    {
                      Object.entries(state).map(([field, value], i) => {
                        if(field === 'id_estado') {
                          return (<td key={`${field}-${i}`}>{value}</td>);
                        } else {
                          return (
                            <td 
                              className={`${editing ? 'field' : undefined}`}
                              key={`${field}-${i}`} 
                              onClick={
                              editing ?
                              () => handleUpdate({field, value, id: state.id_estado}) :
                              undefined
                            }>
                              {value}
                            </td>
                          );
                        }
                      })
                    }
                    {
                      editing &&
                      <td className='d-flex align-items-center justify-content-center' key={`${i}-checkbox`}>
                        <Checkbox id_element={state.id_estado}/>
                      </td>
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    </StateContext.Provider>
  )
};

export default StatesTable;
