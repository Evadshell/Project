// src/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // const handleLogin = async (e) => {

  //   e.preventDefault();
  //   console.log("whit")
  //   try {
  //       console.log("hehe")
  //   const response =   await axios.post('http://localhost:5000/login', { username, password });
  //   if (response.status === 200) {
  //       navigate('/');
  //     } else {
  //       console.log("Login failed");
  //     }

  //   console.log(response)
  //   console.log("success");
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //   }
  // };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password }, { withCredentials: true });
      navigate("/");
      console.log(response.data);
    } catch (error) {
      navigate("/login");

      console.error('Error logging in', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
