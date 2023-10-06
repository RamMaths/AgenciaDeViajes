import axios from 'axios';
import Cookies from 'js-cookie';

//react components
import { useState } from 'react';

// bootstrap components
import { 
  Table,
  Form,
  Button
} from 'react-bootstrap';

const tableFormats = {
  'Ninguna': null,
  'Paises': [
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/countries`
  ]
};

const fetchTable = async (table) => {
  console.log(Cookies);
  const data = await fetch(`http://${import.meta.env.VITE_HOST}:3000/api/locations/countries`);
  console.log(data);
  // axios({
  //   method: 'get',
  //   url: `${table[0]}`
  // }).then(res => {
  //   console.log(res);
  // }, err => {
  //   console.log(err);
  // });
};

const Management = () => {
  const [tableName, setTableName] = useState('Ninguna');
  const [tableData, setTableData] = useState(null);

  const handleTableChange = (e) => {
    setTableName(e.target.value);
  };

  return (
    <div>
      <Form className='m-3'>
        <Form.Group className='mb-3' controlId='tableField'>
          <Form.Label>
            Tabla
          </Form.Label>
          <Form.Select name='tabla' onChange={handleTableChange}>
            { Object.keys(tableFormats).map(table => (
              <option key={table}>{table}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>
      { /*tableName != 'Ninguna' && <Result tableFormat={tableFormats[tableData]}/>*/ }
      <Button onClick={() => fetchTable(tableFormats['Paises'])}>Here</Button>
    </div>
  );
};

const Result = ({tableFormat}) => {
  console.log(tableFormat);
  return (
    <Table className='shadow-sm m-3' responsive striped bordered hover>
      <thead>
        <tr>
          {tableFormat.map(field => (
            <th key={field}>{field}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
        </tr>
      </tbody>
    </Table>
  );
};

export default Management;
