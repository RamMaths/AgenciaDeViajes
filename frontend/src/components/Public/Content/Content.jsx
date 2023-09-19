import {
  Row,
  Card,
  Col,
  Carousel
} from 'react-bootstrap';

//data
import infoCountries from '../utils/infoCountries';

//images
import planeImg from '../../../media/publicity/plane.jpeg';
import ticketImg from '../../../media/publicity/ticket.jpeg';

//css
import './Content.css';

const Content = () => {
  return  (
    <div className='w-100 mb-4'>
      <div className='ms-3 me-3 ms-md-5 me-md-5'>
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <div className='d-flex justify-content-center w-100'>
            <h1 className='text-secondary mt-4'>{infoCountries[0].name}</h1>
          </div>
          <Carousel className='w-100 shadow-sm'>
            {infoCountries[0].cities.map(city => (
              <Carousel.Item className='mt-2' key={city.name}>
                <img className='d-block w-100 carousel-img' src={city.image} style={{maxHeight: '15rem'}}></img>
                <Carousel.Caption>
                  <h3>{city.name}</h3>
                  <p></p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </div>

      <Row className='row-cols-1 row-cols-sm-2 mt-3 ms-3 me-3 ms-md-0 me-md-0 gap-x-3'>
        <Col className=''>
          <Card className='border-white'>
            <div className='d-flex justify-content-center align-items-center'>
              <Card.Img variant='top' className='own-card-img'src={planeImg}></Card.Img>
            </div>
            <Card.Body>
              <Card.Title className='own-card-title text-center'>Todos tus viajes en una sola búsqueda</Card.Title>
              <Card.Text className='own-card-text text-secondary text-center'>
                Tú marcas el recorrido
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col className=''>
          <Card className='border-white'>
            <div className='d-flex justify-content-center align-items-center'>
              <Card.Img variant='top' className='own-card-img'src={ticketImg}></Card.Img>
            </div>
            <Card.Body>
              <Card.Title className='own-card-title text-center'>Conecta varios viajes</Card.Title>
              <Card.Text className='own-card-text text-secondary text-center'>
                Desde aviones hasta camiones
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className='ms-3 me-3 ms-md-5 me-md-5'>
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <div className='d-flex justify-content-center w-100'>
            <h1 className='text-secondary mt-4'>Otros destinos</h1>
          </div>
          <Carousel className='w-100 shadow-sm'>
            {infoCountries[1].cities.map(city => (
              <Carousel.Item className='mt-2' key={city.name}>
                <img className='d-block w-100 carousel-img' src={city.image} style={{maxHeight: '15rem'}}></img>
                <Carousel.Caption>
                  <h3>{city.name}</h3>
                  <p>{infoCountries[1].name}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Content;

