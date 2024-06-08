// App.js
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './Components/Home';
import Login from './Components/Login';
import PrivateRoute from './AuthRoute/AuthRoute';
import StudentDashboard from './Components/Dashboard/Student/StudentDashboard';
import AdminDashboard from './Components/Dashboard/Admin/AdminDashboard';
import FranchiseDashboard from './Components/Dashboard/Franchise/FranchiseDashboard';
import ViewStudentDetails from './Components/Dashboard/Franchise/ViewStudentDetails';
import FranchiseDetails from './Components/Dashboard/Admin/FranchiseDetails';
import TakeTest from './Components/Dashboard/Student/TakeTest';
import CreateTest from './Components/Dashboard/Franchise/CreateTest'
import FranchiseProfile from './Components/Dashboard/Franchise/FranchiseProfile';
const App = () => {

  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/franchise" element={<FranchiseDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/franchise/:id" element={<FranchiseDetails />} />
        <Route path="/franchise-dashboard" element={<FranchiseDashboard />} />
        <Route path="/franchise/:id/profile" element={<FranchiseProfile />} />

        <Route path="/create-test" element={<CreateTest />} />
        <Route path="/take-test/:testId" element={<TakeTest />} />

        <Route path="/student/:id" element={<ViewStudentDetails />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
  );
};

export default App;
