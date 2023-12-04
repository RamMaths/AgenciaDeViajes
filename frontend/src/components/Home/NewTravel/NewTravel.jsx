//
import Cookies from 'js-cookie';

//bootstrap
import { 
  Accordion,
  Container,
  Form,
  Row,
  Col,
  Button
} from 'react-bootstrap';

//context
import { useGlobalContext } from '../../../App';

//react
import { 
  useState,
  useContext,
  createContext,
  useEffect,
  useRef
} from 'react';

//router
import { useNavigate } from 'react-router-dom';

//creating the context
const NewTravelContext = createContext();
export const useNewTravelContext = () => useContext(NewTravelContext);

//my components
import DangerAlert from '../../DangerAlert';
import FromAccordion from './FromAccordion';
import ToAccordion from './ToAccordion';
import People from './People';
import Reservation from './Reservation';

//utils
import { 
  getRequest,
  postRequest
} from '../../utils/Utils';

const NewTravel = () => {
  const navigate = useNavigate();

  const { 
    user,
    error,
    setError
  } = useGlobalContext();
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [transports, setTransports] = useState(null);
  const [transport, setTransport] = useState(null);
  const [people, setPeople] = useState({});
  const [reservations, setReservations] = useState({});

  useEffect(() => {
    getRequest(
      `http://${import.meta.env.VITE_HOST}:3000/api/meantransports`,
      res => {
        let obj = {};
        res.data.data.forEach(el => {
          obj[el.nombre] = el.id_medio_transporte;
        });

        setTransports(obj);
        setTransport(res.data.data[0].nombre)
      },
      err => {
        console.error(err);
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    );
  }, []);

  const handleTransportChange = (e) => {
    setTransport(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formObj = Object.fromEntries(formData.entries());

    if (formObj.fecha_inicio.length <= 0) {
      setError({show: true, message: 'No has seleccionado la fecha de inicio'});
      return;
    }

    if (!transport) {
      setError({show: true, message: 'No has seleccionado un medio de transporte'})
      return;
    }

    if (!origen) {
      setError({show: true, message: 'No has seleccionado el origen del viaje'})
      return;
    }

    if (!destino) {
      setError({show: true, message: 'No has seleccionado el destino del viaje'});
      return;
    }

    if (origen == destino) {
      setError({show: true, message: 'Selecciona un destino diferente'});
      return;
    }

    if (Object.values(people).length <= 0) {
      setError({show: true, message: 'Necesita haber al menos una persona en el viaje'});
      return;
    }

    postRequest(
      `http://${import.meta.env.VITE_HOST}:3000/api/travels`,
      {
        id_usuario: user.id_usuario,
        travel: {
          fecha_salida: formObj.fecha_inicio,
          id_origen: origen,
          id_destino: destino,
          id_medio_transporte: transports[transport]
        },
        people: Object.values(people),
        reservations: Object.values(reservations)
      },
      res => {
        navigate('/home');
      },
      err => {
        console.log(err);
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    )
  };

  return (
    <NewTravelContext.Provider value={{
      origen,
      setOrigen,
      destino,
      setDestino,
      people,
      setPeople,
      reservations,
      setReservations
    }}>
      <Container style={{minHeight: '72vh'}}>
        { error.show && <DangerAlert/> }
        <Form id='general' onSubmit={handleSubmit}>
          <Form.Group className='mt-3' controlId='fechaNacField'>
            <Form.Label>
              Fecha de Ida
            </Form.Label>
            <Form.Control type='date' name='fecha_inicio'></Form.Control>
          </Form.Group>
        </Form>
          { 
            transports &&
            <div className='mt-3'>
              <Form.Label>
                Medio de Transporte
              </Form.Label>
              <Form.Select name='pais' onChange={handleTransportChange}>
                {
                  Array.from(Object.entries(transports)).map(([transport, id]) => {
                    return <option key={`transport-${id}`}>{transport}</option>
                  })
                }
              </Form.Select>
            </div>
          }
          <Row className='mt-4'>
            <Col>
              <Accordion className='' defaultActiveKey='1'>
                <Accordion.Item>
                  <Accordion.Header>Origen</Accordion.Header>
                  <Accordion.Body>
                    <FromAccordion/>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
            <Col>
              <Accordion className='' defaultActiveKey='1'>
                <Accordion.Item>
                  <Accordion.Header>Destino</Accordion.Header>
                  <Accordion.Body>
                    <ToAccordion/>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>

          <Accordion className='pt-3' defaultActiveKey='1'>
            <Accordion.Item>
              <Accordion.Header>Personas</Accordion.Header>
              <Accordion.Body>
                <People/>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion className='pt-3' defaultActiveKey='1'>
            <Accordion.Item>
              <Accordion.Header>Reservaciones (opcional)</Accordion.Header>
              <Accordion.Body>
                <Reservation/>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Row className='mt-3'>
            <Col>
              <Button className='' type='submit' form='general'>
                Crear itinerario
              </Button>
            </Col>
          </Row>
      </Container>
    </NewTravelContext.Provider>
  )
};

export default NewTravel;
