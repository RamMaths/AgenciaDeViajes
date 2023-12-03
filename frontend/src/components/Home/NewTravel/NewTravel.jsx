//
import Cookies from 'js-cookie';

//bootstrap
import { 
  Accordion,
  Container,
  Form,
  Row,
  Col
} from 'react-bootstrap';

//context
import { useGlobalContext } from '../../../App';

//react
import { 
  useState,
  useContext,
  createContext,
  useEffect
} from 'react';

//creating the context
const NewTravelContext = createContext();
export const useNewTravelContext = () => useContext(NewTravelContext);

//my components
import FromAccordion from './FromAccordion';
import ToAccordion from './ToAccordion';

//utils
import { getRequest } from '../../utils/Utils';

const NewTravel = () => {
  const { user } = useGlobalContext();
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [transports, setTransports] = useState(null);
  const [transport, setTransport] = useState(null);

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

  return (
    <NewTravelContext.Provider value={{
      origen,
      setOrigen,
      destino,
      setDestino
    }}>
      <Container style={{minHeight: '72vh'}}>
        <Form>
          <Form.Group className='mt-3' controlId='fechaNacField'>
            <Form.Label>
              Fecha de Ida
            </Form.Label>
            <Form.Control type='date' name='fecha_inicio'></Form.Control>
          </Form.Group>
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
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion className='pt-3' defaultActiveKey='1'>
            <Accordion.Item>
              <Accordion.Header>Reservaciones (opcional)</Accordion.Header>
              <Accordion.Body>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Form>
      </Container>
    </NewTravelContext.Provider>
  )
};

export default NewTravel;
