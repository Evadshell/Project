import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Spinner,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
const StudentDashboard = () => {
  const [StudentData, SetStudentData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const respone = await axios.get("http://localhost:5000/user", {
          withCredentials: true,
        });
        if (respone.data.user.role !== 'student') {
          navigate(`/${respone.data.user.role}`);
        }
        console.log(respone.data.user);
        SetStudentData(respone.data.user);
      } catch (error) {
        navigate("/login");
      }
    };

    checkAuth();
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
    {StudentData.personal_info ? (<>
      <Card>
        <CardHeader>
          <Heading size="md">{StudentData.personal_info.name}</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                About
              </Heading>
              <Text mr={4} pt="2" fontSize="sm">
                {StudentData.personal_info.age}</Text><Text mr={4} pt="2" fontSize="sm">
                {StudentData.personal_info.DOB}</Text><Text mr={4} pt="2" fontSize="sm">
                {StudentData.personal_info.Adress}</Text><Text mr={4} pt="2" fontSize="sm">
                {StudentData.personal_info.contact_no}</Text>
              
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Course
              </Heading>
              <Text pt="2" fontSize="sm">
                {StudentData.course}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Payment Status
              </Heading>
              <Text pt="2" fontSize="sm">
               {StudentData.Payment_status}
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    <Button onClick={logout} >Logout</Button></>
    ):(<><Spinner /></>)}
      
    </div>
  );
};

export default StudentDashboard;
