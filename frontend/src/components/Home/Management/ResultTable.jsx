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

//my components
import UpdateModal from './UpdateModal';
import { patchRequest } from '../../utils/Utils';

//css
import './Management.css';

const ResultTable = () => {
  const {
    editing,
    empty,
    tableData,
    tableName,
    cannotUpdate
  } = useManagementContext();
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateField, setUpdateField] = useState({});

  cannotUpdate.current.clear();

  const handleUpdate = ({field, value, id}) => {
    setShowUpdate(true);
    setUpdateField({field, value, id});
    console.log(id);
  };

  return (
    <Container>
      <UpdateModal showUpdate={showUpdate} setShowUpdate={setShowUpdate} updateField={updateField}/>
      <Table className='shadow-sm' responsive={window.innerWidth <= 750} striped bordered hover>
        <thead>
          <tr className='align-middle text-center'>
            {tableData && !empty && Object.keys(tableData[0]).map((field, i) => {
              if(field.startsWith('id') || field.startsWith('_')) cannotUpdate.current.set(i);
              return (
                <th key={field}>
                  {field.startsWith('_') ? field.replace('_', '') : field}
                </th>
              )
            })}
            {
              empty && tableData.map(objField => {
                const column = objField.column_name;
                if(column.startsWith('id') || column.startsWith('_')) cannotUpdate.current.set(i);
                return <th key={objField.column_name}>
                  {column.startsWith('_') ? column.replace('_', '') : column}
                </th>
              })
            }
          </tr>
        </thead>
        <tbody>
          {tableData && !empty && tableData.map((row, i) => {
            return <tr key={Object.values(row)[i] + `${i}`} className='align-middle text-center'>
              {Object.values(row).map((value, i) => {
                return <td 
                  className={(!cannotUpdate.current.has(i) && editing) ? 'field' : undefined}
                  onClick={(!cannotUpdate.current.has(i) && editing) ? () => handleUpdate({
                    field: Object.keys(row)[i],
                    value,
                    id: Object.values(row)[0]
                  }) : undefined}
                  key={value + `${i}`}>
                  {value}
                </td>
                })}
              {
                editing && <td className='d-flex align-items-center justify-content-center' key={`${i}-checkbox`}><Checkbox id_element={Object.values(row)[0]}/></td>}
            </tr>
          })}
        </tbody>
      </Table>
    </Container>
  );
};

const Checkbox = ({id_element}) => {
  const {
    deletions,
    setDeletions
  } = useManagementContext();

  const handleChange = (event) => {

    if(event.target.checked) {
      setDeletions([...deletions, id_element]);
    } else {
      setDeletions(del => {
        const newArr = del.filter(el => el !== id_element);
        return newArr;
      });
    }
    
  };

  return (
    <div>
      <InputGroup>
        <InputGroup.Checkbox onChange={(event) => handleChange(event)}/>
      </InputGroup>
    </div>
  )
}

export default ResultTable;
