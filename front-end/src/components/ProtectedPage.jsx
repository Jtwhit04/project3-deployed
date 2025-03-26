import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeContext } from '../contexts/EmployeeContext';

function ProtectedPage({ children }) {
  const { employee, loading } = useContext(EmployeeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !employee) {
      navigate('/login');
    }
  }, [employee, loading, navigate]);

  if (loading) {
    return null;
  }

  return children;
}

export default ProtectedPage;