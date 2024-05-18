// App.js
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './Components/Home';
import Login from './Components/Login';
import PrivateRoute from './AuthRoute/AuthRoute';
const App = () => {

  return (
      <Routes>
        <Route path="/login" element={<Login />} />
       
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
  );
};

export default App;
