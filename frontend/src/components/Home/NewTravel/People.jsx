import Cookies from 'js-cookie';

//bootstrap
import { 
  Form,
  Row,
  Col,
  Button,
  Badge
} from 'react-bootstrap';

//react
import { 
  useEffect,
  useState,
  useReducer
} from 'react';

//context
import { useNewTravelContext } from './NewTravel';
import { useGlobalContext } from '../../../App';

//utils
import { getRequest } from '../../utils/Utils';

const People = () => {
  const {
    people,
    setPeople
  } = useNewTravelContext();
  const {
    error,
    setError
  } = useGlobalContext();

  const [sex, setSex] = useState(null);
  const [sexs, setSexs] = useState(null);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    getRequest(
      `http://${import.meta.env.VITE_HOST}:3000/api/sexs`,
      res => {
        let obj = {};
        res.data.data.forEach(el => {
          obj[el.nombre] = el.id_sexo;
        });

        setSexs(obj);
        setSex(res.data.data[0].nombre);
      },
      err => {
        console.error(err);
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    );
  }, []);

  const handleSexChange = (e) => {
    setSex(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formObj = Object.fromEntries(formData.entries());

    if (
      !formObj.nombre ||
      !formObj.paterno ||
      !formObj.materno ||
      !formObj.fecha_nac
    ) {
      setError({
        show: true,
        message: 'Debes ingresar los datos mencionados'
      });
      forceUpdate();
      return;
    }

    setPeople(people => {
      const newObj = people;

      delete formObj['sexo'];
      newObj[formObj.nombre] = {...formObj, id_sexo: sexs[sex]};

      document.getElementById('people').reset();
      return newObj;
    });

    forceUpdate();
  };

  return (
    <>
      {
        Object.values(people).map(person => {
          return(
            <Badge key={person.nombre} bg="secondary">
              {person.nombre}
              <i 
                className='bi bi-x ms-1' 
                onClick={() => {
                  setPeople(people => {
                    const newObj = people;
                    delete newObj[person.nombre]
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
      }

    <Form id='people' onSubmit={handleSubmit}>
      <Form.Group className='' controlId='fechaNacField'>
        <Form.Label className='mt-2'>
          Nombre
        </Form.Label>
        <Form.Control type='text' name='nombre' ></Form.Control>

        <Form.Label className='mt-2'>
          Apellido Paterno
        </Form.Label>
        <Form.Control type='text' name='paterno' ></Form.Control>

        <Form.Label className='mt-2'>
          Apellido Materno
        </Form.Label>
        <Form.Control type='text' name='materno' placeholder='Opcional'></Form.Control>

        <Form.Label className='mt-2'>
          Fecha de Nacimiento
        </Form.Label>
        <Form.Control type='date' name='fecha_nac' ></Form.Control>
      </Form.Group>
      { 
        sexs &&
        <>
          <Form.Label className='mt-2'>
            Sexo
          </Form.Label>
          <Form.Select name='sexo' onChange={handleSexChange}>
          {
            Array.from(Object.entries(sexs)).map(([sex, id]) => {
              return <option key={`sex-${id}`}>{sex}</option>
            })
          }
        </Form.Select>
      </>
    }

      <Row>
        <Col>
          <Button className='mt-3' type='submit' form='people'>
            <span>Añadir</span>
            <i className='ms-2 bi bi-plus-square'></i>
          </Button>
        </Col>
      </Row>
    </Form>
  </>
  )
};

export default People;
