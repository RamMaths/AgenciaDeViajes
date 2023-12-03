//modules and libraries
import * as React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import { useState, createContext, useContext } from 'react';

//components ---------------------------------------------
import PublicRoot from './components/Public/PublicRoot';
import ErrorPage from './ErrorPage';
import Login from './components/Public/Auth/Login';
import Signup from './components/Public/Auth/Signup';
import HomeRoot from './components/Home/HomeRoot';
import Management from './components/Home/Management/Management';
import NewTravel from './components/Home/NewTravel/NewTravel';

//Global Context
const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

//App component
const App = () => {
  const [error, setError] = useState({
    show: false,
    message: ''
  });
  const [serverError, setServerError] = useState(false);
  const [user, setUser] = useState(false);

  //router
  const router = createBrowserRouter([
    {
      path: '/',
      element: !user ? <PublicRoot/> : <Navigate to='/home'/>,
      errorElement: <ErrorPage/>,
      children: [
        {
          path: '/login',
          element: <Login/>,
          errorElement: <ErrorPage/>,
        },
        {
          path: '/signup',
          element: <Signup/>,
          errorElement: <ErrorPage/>
        }
      ]
    },
    {
      path: '/home/',
      element: user ? <HomeRoot/> : <Navigate to='/login'/>,
      errorElement: <ErrorPage/>,
      children: [
        {
          path: '/home/management',
          element: <Management/>
        },
        {
          path: '/home/newtravel',
          element: <NewTravel/>
        }
      ],
    }
  ]);

  return (
    <GlobalContext.Provider value={{
      error,
      setError,
      user,
      setUser,
      serverError,
      setServerError,
    }}>
      <RouterProvider router={router}>
      </RouterProvider>
    </GlobalContext.Provider>
  );
};

export default App;
