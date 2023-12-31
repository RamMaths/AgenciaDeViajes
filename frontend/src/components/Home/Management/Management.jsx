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

//context
import { useGlobalContext } from '../../../App';

//my components
import Options from './Options';
import ResultTable from './ResultTable';
import { getRequest } from '../../utils/Utils';
import StatesTable from './ChildTables/StatesTable/StatesTable';
import CitiesTable from './ChildTables/CitiesTable/CitiesTable';
import HotelsTable from './ChildTables/HotelsTable/HotelsTable';
import RoomsTable from './ChildTables/RoomsTable/RoomsTable';

const tableLinks = {
  'Ninguna': null,
  'Paises': [
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/countries`,
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/countries/datatypes`,
    false
  ],
  'Empresas': [
    `http://${import.meta.env.VITE_HOST}:3000/api/companies`,
    `http://${import.meta.env.VITE_HOST}:3000/api/companies/datatypes`,
    false
  ],
  'Medios De Transporte': [
    `http://${import.meta.env.VITE_HOST}:3000/api/meantransports`,
    `http://${import.meta.env.VITE_HOST}:3000/api/meantransports/datatypes`,
    false
  ],
  'Estados': [
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/states`,
    true
  ],
  'Ciudades': [
    `http://${import.meta.env.VITE_HOST}:3000/api/locations/cities`,
    true
  ],
  'Hoteles': [
    `http://${import.meta.env.VITE_HOST}:3000/api/hotels`,
    true
  ],
  'Habitaciones': [
    `http://${import.meta.env.VITE_HOST}:3000/api/hotels/rooms`,
    true
  ]
};

const ManagementContext = createContext();
export const useManagementContext = () => useContext(ManagementContext);

const Management = () => {
  const [tableName, setTableName] = useState('Ninguna');
  const [tableData, setTableData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [empty, setEmpty] = useState(false);
  const deletions = useRef(new Map([]));
  const cannotUpdate = useRef(new Map([]));
  const [tableDataTypes, setTableDataTypes] = useState(null);
  const { error, setError } = useGlobalContext();

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
    setEditing(false);

    deletions.current.clear();
    setError({...error, show: false});

    if(!tableLinks[e.target.value][tableLinks[e.target.value].length - 1]) {
      fetchInfo(tableLinks[e.target.value][0], setTableData);
    }
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
      cannotUpdate,
      fetchAndSet,
      tableDataTypes,
      setTableDataTypes
    }}>
      <Container className='' style={{minHeight: '70vh'}}>
        <Options/>
        { 
          tableLinks[tableName] &&
          !tableLinks[tableName][tableLinks[tableName].length - 1] &&
          <ResultTable table={tableData}/>
        }
        {
          tableName === 'Estados' &&
          <StatesTable/>
        }
        {
          tableName === 'Ciudades' &&
          <CitiesTable/>
        }
        {
          tableName === 'Hoteles' &&
          <HotelsTable/>
        }
        {
          tableName === 'Habitaciones' &&
          <RoomsTable/>
        }
      </Container>
    </ManagementContext.Provider>
  );
};


export default Management;
