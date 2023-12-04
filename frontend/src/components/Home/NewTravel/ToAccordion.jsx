//
import Cookies from 'js-cookie';

//bootstrap
import { 
  Container,
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

//context
import { useNewTravelContext } from './NewTravel';

//utils
import { getRequest } from '../../utils/Utils';

const ToAccordion = () => {
  const [countries, setCountries] = useState(null);
  const [country, setCountry] = useState(null);
  const [states, setStates] = useState(null);
  const [state, setState] = useState(null);
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

  const {
    destino, setDestino
  } = useNewTravelContext();

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setDestino(cities[city]);
  };

  useEffect(() => {
    getRequest(
      `http://${import.meta.env.VITE_HOST}:3000/api/locations/countries?fields=id_pais,nombre`,
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
        `http://${import.meta.env.VITE_HOST}:3000/api/locations/states?id_pais=${countries[country]}`,
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
        `http://${import.meta.env.VITE_HOST}:3000/api/locations/cities?id_estado=${states[state]}`,
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
      setDestino(cities[city]);
    }
  }, [city])

  return (
    <Container>
      <Row>
        <Col>
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
                <Form.Select name='ciudad' onChange={handleCityChange}>
                  {
                    Array.from(Object.entries(cities)).map(([ciudad, id]) => {
                      return <option key={`ciudad-${id}`}>{ciudad}</option>
                    })
                  }
                </Form.Select>
              </>
            }
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default ToAccordion;
