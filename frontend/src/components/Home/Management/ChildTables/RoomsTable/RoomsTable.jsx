/>p/
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
const RoomContext = createContext();
export const useRoomContext = () => useContext(RoomContext);

//my components
import Checkbox from '../Checkbox';
import AddRoom from './AddRoom';
import UpdateRoom from './UpdateRoom';
import DangerAlert from '../../../../DangerAlert';

//css
import '../ChildTables.css';

const RoomsTable = () => {
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
  const [city, setCity] = useState(null);
  const [hotels, setHotels] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState(null);
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
        `${tableLinks['Habitaciones'][0]}?id_hotel=${hotels[hotel]}`,
        (res) => {
          setRooms(res.data.data);
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
        tableLinks['Habitaciones'][0],
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

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleHotelChange = (e) => {
    setHotel(e.target.value);
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
          let obj = {};
          res.data.data.forEach(el => {
            obj[el.nombre] = el.id_ciudad;
          });

          setCities(obj);
          setCity(res.data.data[0].nombre)
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

  useEffect(() => {
    if(city) {
      getRequest(
        `${tableLinks['Hoteles'][0]}?id_ciudad=${cities[city]}`,
        (res) => {
          let obj = {};
          res.data.data.forEach(el => {
            obj[el.nombre] = el.id_hotel;
          });

          setHotels(obj);
          setHotel(res.data.data[0].nombre)
        },
        (err) => {
          console.error(err);
        },
        {
          'Authorization': `Bearer ${Cookies.get('jwt')}`
        }
      );
    }
  }, [city]);

  useEffect(() => {
    if(hotel) {
      getRequest(
        `${tableLinks['Habitaciones'][0]}?id_hotel=${hotels[hotel]}`,
        (res) => {
          setRooms(res.data.data);
        },
        (err) => {
          console.error(err);
        },
        {
          'Authorization': `Bearer ${Cookies.get('jwt')}`
        }
      );
    }
  }, [hotel]);

  return (
    <RoomContext.Provider value={
      {
        countries,
        country, 
        setCountry,
        states,
        state,
        setState,
        cities,
        city,
        setCity,
        hotels,
        hotel,
        setHotel,
        handleRefresh,
        updateModal,
        setUpdateModal,
        updateField
      }
    }>
      { addModal && <AddRoom show={addModal} handleClose={handleClose}/>}
      { updateModal && <UpdateRoom show={updateModal}/> }
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
              { 
                cities &&
                <>
                  <Form.Label className='pt-3'>
                    Ciudad
                  </Form.Label>
                  <Form.Select name='estado' onChange={handleCityChange}>
                    {
                      Array.from(Object.entries(cities)).map(([ciudad, id]) => {
                        return <option key={`ciudad-${id}`}>{ciudad}</option>
                      })
                    }
                  </Form.Select>
                </>
              }
              { 
                hotels &&
                <>
                  <Form.Label className='pt-3'>
                    Hotel
                  </Form.Label>
                  <Form.Select name='hotel' onChange={handleHotelChange}>
                    {
                      Array.from(Object.entries(hotels)).map(([hotel, id]) => {
                        return <option key={`hotel-${id}`}>{hotel}</option>
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
              <Button className='btn-secondary me-3' onClick={() => {
                if(Object.keys(hotels).length === 0) {
                  setError({
                    show: true,
                    message: 'No has seleccionado un hotel'
                  });
                } else {
                  setEditing(true)
                }
              }}>
                <i className='bi bi-pencil-square fs-5'></i>
              </Button> :
              <Button className='btn-danger d-flex justify-content-center align-items-center me-3' onClick={handleCancel}>
                <i className='bi bi-x-lg fs-5'></i>
              </Button>
            }

            {editing && <Button className='btn-danger me-3'><i className='bi bi-file-earmark-x fs-5' onClick={handleDeletion}></i></Button>}
            {!editing && <Button className='me-3' onClick={() => {
              if(Object.keys(hotels).length === 0) {
                setError({
                  show: true,
                  message: 'No has seleccionado un hotel'
                });
              } else {
                setAddModal(true)
              }
            }}><i className='bi bi-file-earmark-plus fs-5'></i></Button>}
          </div>
        </Col>
      </Row>

      {error.show && <DangerAlert/>}

      <div>
        <Table className='shadow-sm' responsive={window.innerWidth <= 750} striped bordered hover>
          <thead>
            <tr className='align-middle text-center'>
              <th>Id</th>
              <th>Número</th>
              <th>Capacidad</th>
              <th>Hotel</th>
            </tr>
          </thead>
          <tbody className='align-middle text-center'>
            {
              rooms && rooms.length > 0 && rooms.map((room, i) => {
                return (
                  <tr key={room.nombre}>
                    {
                      Object.entries(room).map(([field, value], i) => {
                        if(field === 'id_room') {
                          return (<td key={`${field}-${i}`}>{value}</td>);
                        } else {
                          return (
                            <td 
                              className={`${editing ? 'field' : undefined}`}
                              key={`${field}-${i}`} 
                              onClick={
                              editing ?
                              () => handleUpdate({field, value, id: room.id_habitacion}) :
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
                        <Checkbox id_element={room.id_habitacion}/>
                      </td>
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    </RoomContext.Provider>
  )
};

export default RoomsTable;
