//bootstrap components
import { 
  Button,
  Container,
  Table
} from 'react-bootstrap';

//my components

//context
import { useGlobalContext } from '../../App';

const Home = () => {
  const { user } = useGlobalContext();

  return (
    <Container className='text-secondary' style={{minHeight: '65vh'}}>
      <h1 className='mt-5'>Hola, {user.nombre}</h1>
      <p className='mb-0'>Tus viajes agendados son: </p>
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <div className='d-flex justify-content-end align-items-center w-100 m-3'>
          <Button className='m-1'>Agregar <i className='bi bi-plus-square-fill fs-6 ms-1'></i></Button>
          <Button className='m-1 btn-secondary'>Editar <i className='bi bi-pencil-square fs-6 ms-1'></i></Button>
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
            <tr>
              <td>Hello</td>
              <td>World!</td>
              <td>World!</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Home;
