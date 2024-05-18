// // src/AuthRoute/AuthRoute.jsx
// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';

// const AuthRoute = ({ component: Component, isAuthenticated, ...rest }) => (
//   <Route
//     {...rest}
//     element={
//       isAuthenticated ? (
//         <Component />
//       ) : (
//         <Navigate to="/login" />
//       )
//     }
//   />
// );

// export default AuthRoute;

import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:5000/user', { withCredentials: true });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
