import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const FranchiseDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const respone = await axios.get("http://localhost:5000/user", {
          withCredentials: true,
        });
        // console.log(respone.data.user);
        if (respone.data.user.role !== 'franchise') {
          navigate(`/${respone.data.user.role}`);
        }
        console.log("yes")
      } catch (error) {
        console.log("nah")
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);
  return (
    <div>
      FranchiseDashboard
    </div>
  )
}

export default FranchiseDashboard
