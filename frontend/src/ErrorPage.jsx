//modules
import { useRouteError } from 'react-router-dom';

//ErrorPage component
const ErrorPage = () => {
  const error = useRouteError();
  console.error(error)
  return (
    <div>
      <h1>Ups!</h1>
      <p>Una error inesperado ha ocurrido</p>
      <p>{error.statusText}{error.message}</p>
    </div>
  )
};

export default ErrorPage;
