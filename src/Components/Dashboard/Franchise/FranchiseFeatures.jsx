import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import StudentCards from "./CardComponents/StudentCard";
import AddStudent from "./CardComponents/AddStudent";
import { Button, Heading } from "@chakra-ui/react";
const FranchiseFeatures = () => {
  const navigate = useNavigate();
  const[students,Setstudents]= useState([])
 const [name,Setid] = useState();
 const [id,setid] = useState();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const respone = await axios.get("http://localhost:5000/user", {
          withCredentials: true,
        });
        
        Setid(respone.data.user.center_name)
        setid(respone.data.user._id)

        // console.log(id)
      } catch (error) {
        navigate("/login");
      }
    };
    checkAuth();
    const getstudent = async()=>{
      const response = await axios.get(`http://localhost:5000/students/${name}`, {
        withCredentials: true,
      });
      Setstudents(response.data.students)
      console.log(response.data.students);
    }
    getstudent();
  }, [navigate,name]);
    const logout = async () => {
      try {
        await axios.get('http://localhost:5000/logout', { withCredentials: true });
        navigate("/login");
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
    const handleViewProfile = () => {
      navigate(`/franchise/${id}/profile`);
    };
  const handleCreateTest = () => {
    navigate('/create-test');
  };
  return (
    <div>
            <Button onClick={handleViewProfile}>View Profile</Button>

      <AddStudent />
      {name? <>
        <StudentCards students={students} />
      </>
    :<><h1>Loading</h1></>  
    }
       <Button onClick={handleCreateTest}>Create Test</Button>

       <Button variant='solid' colorScheme="red" onClick={logout} >Logout</Button>
    </div>
  )
}

export default FranchiseFeatures
