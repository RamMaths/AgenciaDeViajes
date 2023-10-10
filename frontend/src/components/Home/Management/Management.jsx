import Cookies from 'js-cookie';

//react components
import { 
  useState,
  useContext,
  createContext
} from 'react';

// bootstrap components
import { 
  Container
} from 'react-bootstrap';

//my components
import Options from './Options';
import ResultTable from './ResultTable';
import { getRequest } from '../../utils/Utils';

const tableLinks = {
  'Ninguna': null,
  'Paises': [
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/countries`,
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/countries/datatypes`
  ]
};

const ManagementContext = createContext();
export const useManagementContext = () => useContext(ManagementContext);

const Management = () => {
  const [tableName, setTableName] = useState('Ninguna');
  const [tableData, setTableData] = useState(null);

  const handleTableChange = (e) => {
    setTableName(e.target.value);
    if(e.target.value == 'Ninguna') return;
    fetchInfo(tableLinks[e.target.value][0], setTableData);
  };

  const fetchInfo = async (url, hook) => {
    getRequest(
      url,
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      },
      (res) => {
        hook(res.data.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  return (
    <ManagementContext.Provider value={{
      handleTableChange,
      tableLinks, 
      tableName, 
      setTableName, 
      tableData, 
      setTableData,
      fetchInfo
    }}>
      <Container>
        <Options/>
        { tableName != 'Ninguna' && tableData && <ResultTable table={tableData}/> }
      </Container>
    </ManagementContext.Provider>
  );
};


export default Management;
