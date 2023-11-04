import Cookies from 'js-cookie';

//react components
import { 
  useState,
  useContext,
  createContext,
  useRef
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
  ],
  'Estados': [
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/states`,
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/states/datatypes`
  ]
};

const ManagementContext = createContext();
export const useManagementContext = () => useContext(ManagementContext);

const Management = () => {
  const [tableName, setTableName] = useState('Ninguna');
  const [tableData, setTableData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [deletions, setDeletions] = useState([]);
  const cannotUpdate = useRef(new Map([]));
  const [tableDataTypes, setTableDataTypes] = useState(null);

  const fetchAndSet = async (url, hook) => {
    getRequest(
      url,
      (res) => {
        const newObj = {};
        res.data.data.map(el => {
          newObj[el.column_name] = el.data_type;
        });
        hook(newObj);
      },
      (err) => {
        console.log(err);
      },
      {
        'Authorization': `Bearer ${Cookies.get('jwt')}`
      }
    );
  };

  const handleTableChange = (e) => {
    setTableName(e.target.value);
    if(e.target.value == 'Ninguna') {
      setEditing(false);
      return;
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
      empty,
      deletions,
      setDeletions,
      cannotUpdate,
      fetchAndSet,
      tableDataTypes,
      setTableDataTypes
    }}>
      <Container className='' style={{minHeight: '70vh'}}>
        <Options/>
        { tableName != 'Ninguna' && tableData && <ResultTable table={tableData}/> }
      </Container>
    </ManagementContext.Provider>
  );
};


export default Management;
