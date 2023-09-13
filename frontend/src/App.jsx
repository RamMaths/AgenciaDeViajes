//modules and libraries
import * as React from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { useState, createContext, useContext } from 'react';

//components
import Root from './components/Root';
import ErrorPage from './ErrorPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

//Global Context
const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

//router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
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
  }
]);

//App component
const App = () => {
  const [error, setError] = useState({
    show: false,
    message: ''
  });

  return (
    <GlobalContext.Provider value={{error, setError}}>
      <RouterProvider router={router}>
      </RouterProvider>
    </GlobalContext.Provider>
  );
};

export default App;
