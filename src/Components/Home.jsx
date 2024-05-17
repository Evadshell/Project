import { Center } from '@chakra-ui/react'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const getUser = async () => {
        try {
          const response = await axios.get("http://localhost:5000/login", {
            withCredentials: true,
          });
          console.log(response);
        } catch (error) {
            console.log(error);
          navigate("/login");
        }
      };
      useEffect(() => {
        getUser();
      }, []);
  return (
    <div>
        <Center>
      <button>Logout</button>

        </Center>
    </div>
  )
}

export default Home
