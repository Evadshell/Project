// App.js
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './Components/Home';
import Login from './Components/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   console.log("running")
  //   // Check if the user is authenticated
  //   axios.get('http://localhost:5000/login', { withCredentials: true })
  //     .then(response => {
  //       console.log("hehe",response);
  //       if (response.data.isAuthenticated) {
  //         setIsAuthenticated(true); // User is authenticated
  //       } else {
  //         setIsAuthenticated(false); // User is not authenticated
  //       }
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }, []);

  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={<Home />}
        />
      </Routes>
  );
};

export default App;
