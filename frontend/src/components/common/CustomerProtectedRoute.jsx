import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CustomerProtectedRoute({ children }) {
  const { isCustomerAuthenticated } = useAuth();
  if (!isCustomerAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
