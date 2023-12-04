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
const CityContext = createContext();
export const useCityContext = () => useContext(CityContext);

//my components
import Checkbox from '../Checkbox';
import AddCity from './AddCity';
import UpdateCity from './UpdateCity';
import DangerAlert from '../../../../DangerAlert';

//css
import '../ChildTables.css';

const CitiesTable = () => {
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
  const [state, setState] = useState(null);
  const [cities, setCities] = useState(null);
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
        `${tableLinks['Ciudades'][0]}?id_estado=${states[state]}`,
        (res) => {
          setCities(res.data.data);
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
        tableLinks['Ciudades'][0],
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

  const handleStateChange = (e) => {
    setState(e.target.value);
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
          let obj = {};
          res.data.data.forEach(el => {
            obj[el.nombre] = el.id_estado;
          });

          setStates(obj);
          setState(res.data.data[0].nombre)
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

  useEffect(() => {
    if(state) {
      getRequest(
        `${tableLinks['Ciudades'][0]}?id_estado=${states[state]}`,
        (res) => {
          setCities(res.data.data);
        },
        (err) => {
          console.error(err);
        },
        {
          'Authorization': `Bearer ${Cookies.get('jwt')}`
        }
      );
    }
  }, [state]);

  return (
    <CityContext.Provider value={
      {
        countries,
        country, 
        setCountry,
        states,
        state,
        setState,
        handleRefresh,
        updateModal,
        setUpdateModal,
        updateField
      }
    }>
      { addModal && <AddCity show={addModal} handleClose={handleClose}/>}
      { updateModal && <UpdateCity show={updateModal} ></UpdateCity> }
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
                        return <option key={`pais-${id}`}>{pais}</option>
                      })
                    }
                  </Form.Select>
                </>
              }
              { 
                states &&
                <>
                  <Form.Label className='pt-3'>
                    Estado
                  </Form.Label>
                  <Form.Select name='estado' onChange={handleStateChange}>
                    {
                      Array.from(Object.entries(states)).map(([estado, id]) => {
                        return <option key={`estado-${id}`}>{estado}</option>
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
              <Button className='btn-danger d-flex justify-content-center align-items-center me-3' onClick={handleCancel}>
                <i className='bi bi-x-lg fs-5'></i>
              </Button>
            }

            {editing && <Button className='btn-danger me-3'><i className='bi bi-file-earmark-x fs-5' onClick={handleDeletion}></i></Button>}
            {!editing && <Button className='me-3' onClick={() => setAddModal(true)}><i className='bi bi-file-earmark-plus fs-5'></i></Button>}
          </div>
        </Col>
      </Row>

      {error.show && <DangerAlert/>}

      <div>
        <Table className='shadow-sm' responsive={window.innerWidth <= 750} striped bordered hover>
          <thead>
            <tr className='align-middle text-center'>
              <th>Id</th>
              <th>Ciudad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody className='align-middle text-center'>
            {
              cities && cities.length > 0 && cities.map((city, i) => {
                console.log(city);
                return (
                  <tr key={city.nombre}>
                    {
                      Object.entries(city).map(([field, value], i) => {
                        if(field === 'id_estado') {
                          return (<td key={`${field}-${i}`}>{value}</td>);
                        } else {
                          return (
                            <td 
                              className={`${editing ? 'field' : undefined}`}
                              key={`${field}-${i}`} 
                              onClick={
                              editing ?
                              () => handleUpdate({field, value, id: city.id_ciudad}) :
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
                        <Checkbox id_element={city.id_ciudad}/>
                      </td>
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    </CityContext.Provider>
  )
};

export default CitiesTable;
