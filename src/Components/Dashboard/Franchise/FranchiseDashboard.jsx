import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FranchiseFeatures from "./FranchiseFeatures";
const FranchiseDashboard = () => {
  const navigate = useNavigate();
  // const[students,Setstudents]= useState([])
 const [id,Setid] = useState();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const respone = await axios.get("http://localhost:5000/user", {
          withCredentials: true,
        });
        if (respone.data.user.role !== 'franchise') {
          navigate(`/${respone.data.user.role}`);
        }
        Setid(respone.data.user.center_name)
        // console.log(id)
      } catch (error) {
        navigate("/login");
      }
    };
    checkAuth();
    // const getstudent = async()=>{
    //   const response = await axios.get(`http://localhost:5000/students/${id}`, {
    //     withCredentials: true,
    //   });
    //   Setstudents(response.data.students)
    //   console.log(response.data.students);
    // }
    // getstudent();
  }, [navigate,id]);
  //   const logout = async () => {
  //     try {
  //       await axios.get('http://localhost:5000/logout', { withCredentials: true });
  //       navigate("/login");
  //     } catch (error) {
  //       console.error('Error logging out:', error);
  //     }
  //   };

  // const handleCreateTest = () => {
  //   navigate('/create-test');
  // };
  return (
    <div>
    <FranchiseFeatures />
    </div>
  )
}

export default FranchiseDashboard
