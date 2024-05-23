import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import StudentCards from "./CardComponents/StudentCard";
import AddStudent from "./CardComponents/AddStudent";
const FranchiseDashboard = () => {
  const navigate = useNavigate();
  const[students,Setstudents]= useState([])
 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const respone = await axios.get("http://localhost:5000/user", {
          withCredentials: true,
        });
        if (respone.data.user.role !== 'franchise') {
          navigate(`/${respone.data.user.role}`);
        }
      } catch (error) {
        navigate("/login");
      }
    };
    checkAuth();
    const getstudent = async()=>{
      const response = await axios.get("http://localhost:5000/students", {
        withCredentials: true,
      });
      Setstudents(response.data.students)
      console.log(response.data.students);
    }
    getstudent();
  }, [navigate]);
  
  return (
    <div>
      <AddStudent />
       <StudentCards students={students} />
    </div>
  )
}

export default FranchiseDashboard
