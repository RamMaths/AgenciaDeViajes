/>p/
import Cookies from 'js-cookie';

//bootstrap components
import { 
  Button,
  Container,
  Table
} from 'react-bootstrap';

//context
import { useGlobalContext } from '../../App';

//react
import { 
  useState,
  useEffect
} from 'react';

//router
import { useNavigate } from 'react-router-dom';

//utils
import { 
  getRequest,
  deleteRequest
} from '../utils/Utils';

//css
import './Home.css';

const Home = () => {
  const { user } = useGlobalContext();
  const navigate = useNavigate();

  const [itineraries, setItineraries] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleRefresh = () => {
    getRequest(
      `http://${import.meta.env.VITE_HOST}:3000/api/travels?id=${user.id_usuario}`,
      res => {
        setItineraries(res.data.data);
      },
      err => {
        console.error(err);
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    );
  }

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleDeletion = (id) => {
    console.log(id);
    deleteRequest(
      `http://${import.meta.env.VITE_HOST}:3000/api/travels`,
      {
        id_itinerario: id
      },
      (res) => {
        handleRefresh();
        setDeleting(false);
      },
      (err) => {
        console.error(err);
        // setError({
        //   show: true,
        //   message: err.response.data.message
        // });
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    );
  };

  return (
    <Container className='text-secondary' style={{minHeight: '65vh'}}>
      <h1 className='mt-5'>Hola, {user.nombre}</h1>
      <p className='mb-0'>Tus viajes agendados son: </p>
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <div className='d-flex justify-content-end align-items-center w-100 m-3'>
          <Button className='m-1' onClick={() => navigate('/home/newtravel')}>Agregar <i className='bi bi-plus-square-fill fs-6 ms-1'></i></Button>
          {
            !deleting ?
            (
              <Button className='m-1 btn-danger' onClick={() => setDeleting(true)}>
                Eliminar <i className='bi bi-trash fs-6 ms-1'></i>
              </Button>
            ) :
            (
              <Button className='m-1 btn-danger' onClick={() => setDeleting(false)}>
                Cancelar <i className='bi bi-x fs-6 ms-1'></i>
              </Button>
            )
          }
        </div>
        <Table className='shadow-sm' striped bordered hover>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Origen</th>
              <th>Destino</th>
            </tr>
          </thead>
          <tbody>
            {
              itineraries && (
                itineraries.map(itinerary => {
                  const date = new Date(itinerary.fecha_salida);
                  return (
                    <tr 
                      onClick={
                        deleting ?
                        (() => handleDeletion(itinerary.id_itinerario)) :
                        undefined
                      }
                      className={
                        deleting ? 
                        'deletion':
                        undefined
                      }
                      key={itinerary.id_itinerario}
                    >
                      <td>{`${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`}</td>
                      <td>{itinerary.origen}</td>
                      <td>{itinerary.destino}</td>
                    </tr>
                  )
                })
              )
            }
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Home;
