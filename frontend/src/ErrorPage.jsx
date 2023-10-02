//modules
import { useRouteError } from 'react-router-dom';

//ErrorPage component
const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div>
      <h1>Ups!</h1>
      <p>Falla interna del servidor. Por favor vuelva a intentarlo más tarde</p>
    </div>
  )
};

export default ErrorPage;
