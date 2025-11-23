import { useContext, type ReactNode } from 'react'
import { AuthContext } from './loginContext'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}: {children : ReactNode}) => {
  const {login} = useContext(AuthContext);
  return (
    login ? children : <Navigate to={'/'}/>
  )
}

export default ProtectedRoute