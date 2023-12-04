//
import Cookies from 'js-cookie';

//util
import { 
  Form,
  Row,
  Col,
  Button,
  Badge
} from 'react-bootstrap';

//context
import { useNewTravelContext } from './NewTravel';
import { useGlobalContext } from '../../../App';

//react
import { 
  useState,
  useEffect,
  useReducer
} from 'react';

//utils
import { getRequest } from '../../utils/Utils';

const Reservation = () => {
  const [hotels, setHotels] = useState(null);
  const [hotel, setHotel] = useState(null);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const {
    destino,
    reservations,
    setReservations
  } = useNewTravelContext();

  const {
    error,
    setError
  } = useGlobalContext();

  const handleHotelChange = (e) => {
    setHotel(e.target.value);
  };

  useEffect(() => {
    if(destino) {
      getRequest(
        `http://${import.meta.env.VITE_HOST}:3000/api/hotels?id_ciudad=${destino}`,
        (res) => {
          let obj = {};

          res.data.data.forEach(el => {
            obj[el.nombre] = el.id_hotel;
          });

          setHotels(obj);
          setHotel(Object.keys(obj)[0]);
        },
        (err) => {
          console.error(err);
        },
        {
          'Authorization': `Bearer ${Cookies.get('jwt')}`
        }
      );
    }
  }, [destino]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formObj = Object.fromEntries(formData.entries());

    if (
      !hotel ||
      formObj.fecha_inicio.length <= 0 ||
      formObj.fecha_termino.length <= 0
    ) {
      console.log('error')
      setError({
        show: true,
        message: 'Debes ingresar los datos mencionados'
      });
      forceUpdate();
      return;
    }

    setReservations(reservation => {
      const newObj = reservation;

      newObj[hotel] = {
        id_hotel: hotels[hotel],
        fecha_inicio: formObj.fecha_inicio,
        fecha_termino: formObj.fecha_termino
      };

      return newObj;
    });

    document.getElementById('reservation').reset();
    forceUpdate();
  };

  return (
    <>
      {
        reservations && (
          Array.from(Object.entries(reservations)).map(([key, reservation]) => {
            return(
              <Badge key={key} bg="secondary">
                {key}
                <i 
                  className='bi bi-x ms-1' 
                  onClick={() => {
                    setReservations(reservation => {
                      const newObj = reservation;
                      delete newObj[key]
                      forceUpdate();
                      return newObj;
                    });
                  }}
                  style={{cursor: 'pointer'}}
                >

                </i>
              </Badge>
            )
          })
        )
      }
      { 
        hotels &&
        <Form id='reservation' className='mt-2' onSubmit={handleSubmit}>
          <Form.Label>
            Hotel
          </Form.Label>
          <Form.Select name='hotel' onChange={handleHotelChange}>
            {
              Array.from(Object.entries(hotels)).map(([hotel, id]) => {
                return <option key={`hotel-${id}`}>{hotel}</option>
              })
            }
          </Form.Select>
          
          <Row className='mt-3'>
            <Col>
              <Form.Label>
                Fecha de Inicio
              </Form.Label>
              <Form.Control type='date' name='fecha_inicio'></Form.Control>
            </Col>
            <Col>
              <Form.Label>
                Fecha de Termino
              </Form.Label>
              <Form.Control type='date' name='fecha_termino'></Form.Control>
            </Col>
          </Row>
        </Form>
      }
        <Button className='mt-3' type='submit' form='reservation'>
          <span>Añadir</span>
          <i className='ms-2 bi bi-plus-square'></i>
        </Button>
    </>
  );
};

export default Reservation;
