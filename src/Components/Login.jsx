// src/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Center, HStack, InputGroup, InputRightElement, Radio, RadioGroup, Spacer, Toast } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import {
  Flex,
  Box,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  FormControl,
  FormLabel,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [who,Setwho]= useState('student');
  const navigate = useNavigate();
  const toast = useToast()

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
      const response = await axios.post('http://localhost:5000/login', { username, password,who }, { withCredentials: true });
      console.log(username,password,who);
      navigate(`/${who}`);
      toast({
        title: 'Logged In',
        // description: "We've created your account for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      console.log(response.data);
    } catch (error) {
      navigate("/login");

      console.error('Error logging in', error);
    }
  };
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <form onSubmit={handleLogin}>
      <Spacer />
      {/* <button onClick={navigate("/register")}>Register</button> */}
      <Center>      <Flex align="center" justify="center" minHeight="100vh">
                <Box width="400px" p="6" boxShadow="lg" rounded="md" bg="white">
                 <Center> <Text  fontSize="xl" fontWeight="semibold" mb="4" color="black">
  Login
</Text></Center>
      <FormControl mb="4">
      <FormLabel as='legend'>Login As:</FormLabel>
  <RadioGroup mb="4"  defaultValue='student'>
    <HStack onChange={(e)=> Setwho(e.target.value)} spacing='24px'>
      <Radio value='student'>Student</Radio>
      <Radio value='franchise'>Franchise</Radio>
      <Radio value='admin'>Admin</Radio>
    </HStack>
  </RadioGroup>
                      <FormLabel  color="black" >Username</FormLabel>
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        color="black"
                        _placeholder={{ color: 'grey' }} 
                      />
                    </FormControl>
                    <FormControl mb="4">
                      <FormLabel  color="black" >Password</FormLabel>
                      
                        <InputGroup size='md'>
      <Input
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Enter password'
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
                    </FormControl>
                    <Button type="submit" colorScheme="teal" width="full">
                      Login
                    </Button>
                  
                    </Box> </Flex>
                    </Center>
  </form>
  );
};

export default LoginPage;
