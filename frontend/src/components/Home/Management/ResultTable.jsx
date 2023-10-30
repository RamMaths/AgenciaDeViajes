//bootstrap components
import { 
  Table,
  Container,
  Button,
  InputGroup
} from 'react-bootstrap';

//context
import { useManagementContext } from './Management';

//react
import { useState } from 'react';

import './Management.css';

const ResultTable = () => {
  const {
    editing,
    setEditing,
    empty,
    tableData,
    tableName
  } = useManagementContext();

  const [checked, setChecked] = useState(false);

  const handleDeleteRow = (id) => {
    console.log(id);
  };

  return (
    <Container>
      <Table className='shadow-sm' responsive={window.innerWidth <= 750} striped bordered hover>
        <thead>
          <tr>
            {tableData && !empty && Object.keys(tableData[0]).map(field => {
              return (
                <th key={field}>
                  {field.startsWith('_') ? field.replace('_', '') : field}
                </th>
              )
            })}
            {
              empty && tableData.map(objField => (
                <th key={objField.column_name}>
                  {objField.startsWith('_') ? objField.replace('_', '') : objField}
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {tableData && !empty && tableData.map((row, i) => {
            const id = `${tableName}-${i}`;
            return <tr key={Object.values(row)[i] + `${i}`} className='align-middle text-center' id={id}>
              {Object.values(row).map((value, i) => (
                <td key={value + `${i}`}>{value}</td>
              ))}
              {editing && <Checkbox id={id} setChecked={setChecked}/>}
            </tr>
          })}
        </tbody>
      </Table>
    </Container>
  );
};

const Checkbox = ({id, setChecked}) => {

  const handleChange = (event) => {
    const tr = document.getElementById(id);

    if(event.target.checked) {
      tr.setAttribute('bgcolor', '#fa344');
      setChecked(false);
    } else {
      tr.classList.remove('selected');
      setChecked(true);
    }
    
  };

  return (
    <>
      <InputGroup>
        <InputGroup.Checkbox onChange={(event) => handleChange(event, id)}/>
      </InputGroup>
    </>
  )
}

export default ResultTable;
