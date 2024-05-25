import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import StudentCards from "./CardComponents/StudentCard";
import AddStudent from "./CardComponents/AddStudent";
import { Button } from "@chakra-ui/react";
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
    const logout = async () => {
      try {
        await axios.get('http://localhost:5000/logout', { withCredentials: true });
        navigate("/login");
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
  return (
    <div>
      <AddStudent />
       <StudentCards students={students} />
       <Button variant='solid' colorScheme="red" onClick={logout} >Logout</Button>
    </div>
  )
}

export default FranchiseDashboard
