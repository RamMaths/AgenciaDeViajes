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
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/countries/datatypes`,
    true // this means if it is a parent table which must be at the very end of the array
  ],
  'Estados': [
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/states`,
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/states/datatypes`,
    ``,
    false
  ]
};

const ManagementContext = createContext();
export const useManagementContext = () => useContext(ManagementContext);

const Management = () => {
  const [tableName, setTableName] = useState('Ninguna');
  const [tableData, setTableData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [childrenCol, setChildrenCol] = useState(false);

  const handleTableChange = (e) => {
    setTableName(e.target.value);
    if(e.target.value == 'Ninguna') {
      setEditing(false);
      return;
    }
    if(!tableLinks[e.target.value][tableLinks[e.target.value].length - 1]) {
      // fetchInfo(tableLinks[e.target.value][2], setChildrenCol);
    }
    fetchInfo(tableLinks[e.target.value][0], setTableData);
  };

  const handleRefresh = () => {
    fetchInfo(tableLinks[tableName][0], setTableData);
  };

  const fetchInfo = async (url, hook) => {
    getRequest(
      url,
      (res) => {
        if(res.data.empty) setEmpty(res.data.empty);
        else setEmpty(false);
        hook(res.data.data);
      },
      (err) => {
        console.log(err);
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
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
      fetchInfo,
      handleRefresh,
      editing,
      setEditing,
      empty
    }}>
      <Container className='' style={{minHeight: '70vh'}}>
        <Options/>
        { tableName != 'Ninguna' && tableData && <ResultTable table={tableData}/> }
      </Container>
    </ManagementContext.Provider>
  );
};


export default Management;
