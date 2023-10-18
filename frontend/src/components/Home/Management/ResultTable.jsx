//bootstrap components
import { 
  Table,
  Container
} from 'react-bootstrap';

//context
import { useManagementContext } from './Management';

const ResultTable = () => {
  const {
    editing,
    setEditing,
    empty,
    tableData
  } = useManagementContext();

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
            return <tr key={Object.values(row)[i] + `${i}`}>
              {Object.values(row).map((value, i) => (
                <td key={value + `${i}`}>{value}</td>
              ))}
              {editing && <td>hello</td>}
            </tr>
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default ResultTable;
