import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
  const user = true;
  const location = useLocation();

  // get user info
  // const user = TokenService.getUser() || false;
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
