import { type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store/store';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const login = useSelector((state: RootState) => state.auth.isAuthenticated);
  return (
    login ? <>{children}</> : <Navigate to={'/'} />
  );
};

export default ProtectedRoute;
