//bootstrap components
import { 
  Table,
  Container
} from 'react-bootstrap';

const ResultTable = ({table}) => {

  return (
    <Container>
      <Table className='shadow-sm' responsive={window.innerWidth <= 750} striped bordered hover>
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
              <td>hello</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ResultTable;
