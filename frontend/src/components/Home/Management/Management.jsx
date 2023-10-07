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

const Management = () => {
  const [tableName, setTableName] = useState('Ninguna');
  const [tableData, setTableData] = useState(null);

  const handleTableChange = (e) => {
    setTableName(e.target.value);
    fetchTable(e.target.value);
  };

  const fetchTable = async (table) => {
    if(table == 'Ninguna') return;
    axios({
      method: 'get',
      url: `${tableFormats[table][0]}`,
      headers: {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    }).then(res => {
      setTableData(res.data.data);
    }, err => {
      console.log(err);
    });
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
      { tableName != 'Ninguna' && tableData && <Result table={tableData}/> }
    </div>
  );
};

const Result = ({table}) => {
  return (
    <Table className='shadow-sm m-3' responsive striped bordered hover>
      <thead>
        <tr>
          {table && Object.keys(table[0]).map(field => {
            return <th key={field}>{field}</th>
          })}
        </tr>
      </thead>
      <tbody>
        {table && table.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map(value => (
              <td key={value}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Management;
