// App.js
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './Components/Home';
import Login from './Components/Login';
import PrivateRoute from './AuthRoute/AuthRoute';
import StudentDashboard from './Components/Dashboard/StudentDashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import FranchiseDashboard from './Components/Dashboard/FranchiseDashboard';
import Register from './Components/Register';
import ViewStudentDetails from './Components/Dashboard/ViewStudentDetails';
const App = () => {

  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/franchise" element={<FranchiseDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/student/:id" element={<ViewStudentDetails />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
  );
};

export default App;
