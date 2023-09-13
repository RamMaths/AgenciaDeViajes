//modules and libraries
import * as React from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

//components
import Root from './components/Root';
import ErrorPage from './ErrorPage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

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
  return (
    <RouterProvider router={router}>
    </RouterProvider>
  );
};

export default App;
