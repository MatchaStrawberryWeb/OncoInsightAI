import React from 'react';
import { Navigate } from 'react-router-dom';

const Protected = ({ component: Component }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default Protected;
