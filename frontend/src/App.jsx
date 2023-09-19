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

//Global Context
const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

//App component
const App = () => {
  const [error, setError] = useState({
    show: false,
    message: ''
  });
  const [user, setUser] = useState(false);

  //router
  const router = createBrowserRouter([
    {
      path: "/",
      element: !user ? <PublicRoot/> : <Navigate to='/home'/>,
      errorElement: <ErrorPage/>,
      children: [
        {
          path: "/login/",
          element: <Login/>
        },
        {
          path: "/signup",
          element: <Signup/>
        }
      ]
    },
    {
      path: '/home/',
      element: user ? <HomeRoot/> : <Navigate to='/login'/>,
      errorElement: <ErrorPage/>,
    }
  ]);

  return (
    <GlobalContext.Provider value={{error, setError, user, setUser}}>
      <RouterProvider router={router}>
      </RouterProvider>
    </GlobalContext.Provider>
  );
};

export default App;
