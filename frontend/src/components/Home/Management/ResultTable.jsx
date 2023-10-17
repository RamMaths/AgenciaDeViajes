//bootstrap components
import { 
  Table,
  Container
} from 'react-bootstrap';

//context
import { useManagementContext } from './Management';

const ResultTable = ({table}) => {
  const {
    editing,
    setEditing,
    empty
  } = useManagementContext();

  return (
    <Container>
      <Table className='shadow-sm' responsive={window.innerWidth <= 750} striped bordered hover>
        <thead>
          <tr>
            {table && !empty && Object.keys(table[0]).map(field => {
              return (
                <th key={field}>
                  {field.startsWith('_') ? field.replace('_', '') : field}
                </th>
              )
            })}
            {
              empty && table.map(objField => (
                <th key={objField.column_name}>
                  {objField.startsWith('_') ? objField.replace('_', '') : objField}
                </th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {table && !empty && table.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map(value => (
                <td key={value}>{value}</td>
              ))}
              {editing && <td>hello</td>}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ResultTable;
