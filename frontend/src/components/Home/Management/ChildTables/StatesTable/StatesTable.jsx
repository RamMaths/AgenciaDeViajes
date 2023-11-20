//bootstrap
import { 
  Row,
  Col,
  Form
} from "react-bootstrap";

const dependentData = [
  `http://${import.meta.env.VITE_HOST}:3000/api/locations/countries`,
];

const StatesTable = () => {
  return (
    <div>
      <Row>
        <Col>
          <Form id='tables' className=''>
            <Form.Group className='' controlId='tableField'>
              <Form.Label>
                Pais
              </Form.Label>
              <Form.Control>

              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </div>
  )
};

export default StatesTable;
