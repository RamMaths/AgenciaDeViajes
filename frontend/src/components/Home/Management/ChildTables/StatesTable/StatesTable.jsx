//cookies
import Cookies from 'js-cookie';

//bootstrap
import { 
  Row,
  Button,
  Col,
  Form
} from 'react-bootstrap';

//react 
import { 
  useEffect,
  useState
} from 'react';

//utils
import { getRequest, deleteRequest } from '../../../../utils/Utils';
import { useManagementContext } from '../../Management';
import { useGlobalContext } from '../../../../../App';

const countriesTableLink = `http://${import.meta.env.VITE_HOST}:3000/api/locations/countries`;

const StatesTable = () => {
  const {
    editing,
    setEditing,
    deletions
  } = useManagementContext();

  const {
    error,
    setError
  } = useGlobalContext();

  const [countries, setCountries] = useState(null);
  const [showAgregar, setShowAgregar] = useState(false);
  const [country, setCountry] = useState(null);

  const handleShowAgregar = () => {
    setShowAgregar(true);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    deletions.current.clear();
    setError({...error, show: false});
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
        tableLinks[tableName][0],
        {
          arr
        },
        (res) => {
          handleRefresh();
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

  useEffect(() => {
    getRequest(
      `${countriesTableLink}?fields=id_pais,nombre`,
      res => {

        let obj = {};
        res.data.data.forEach(el => {
          obj[el.nombre] = el.id_pais;
        });

        console.log(obj);

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

  console.log(country);

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  return (
    <div>
      <Row>
        <Col>
          <Form id='tables' className='pt-3'>
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
                        return <option key={id}>{pais}</option>
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
              <Button className='btn-secondary ms-3 me-3' onClick={() => setEditing(true)}>
                <i className='bi bi-pencil-square fs-5'></i>
              </Button> :
              <Button className='btn-danger d-flex justify-content-center align-items-center ms-3 me-3' onClick={handleCancel}>
                <i className='bi bi-x-lg fs-5'></i>
              </Button>
            }

            {editing && <Button className='btn-danger me-3'><i className='bi bi-file-earmark-x fs-5' onClick={handleDeletion}></i></Button>}
            {!editing && <Button className='me-3' onClick={handleShowAgregar}><i className='bi bi-file-earmark-plus fs-5'></i></Button>}
          </div>
        </Col>
      </Row>


    </div>
  )
};

export default StatesTable;
