import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Heading,
  Flex,
  Image,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Divider,
  Container,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  useToast,
  Spacer,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useNavigate } from "react-router-dom";

const ViewStudentProfile = () => {
  const [student, setStudent] = useState({});
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  useEffect(() => {
        const checkAuth = async () => {
          try {
            const respone = await axios.get("http://localhost:5000/user", {
              withCredentials: true,
            });
            if (respone.data.user.role !== 'student') {
              navigate(`/${respone.data.user.role}`);
            }
            // console.log(respone.data.user);
            setStudent(respone.data.user);
          } catch (error) {
            navigate("/login");
          }
        };
    
        checkAuth();

        const fetchTests = async () => {
          const response = await axios.get('http://localhost:5000/getTests');
          setTests(response.data.test);
          console.log(response)
          // console.log(tests)
          // console.log(tests)
        };
    
        fetchTests();

      }, [navigate]);

      // useEffect(() => {
      // }, [tests]);
    
      const handleTakeTest = (testId) => {
        navigate(`/take-test/${testId}`);
      };
  const downloadIDCard = async () => {
    window.location.href = `http://localhost:5000/download/${student._id}`;
  };
  const logout = async () => {
        try {
          await axios.get('http://localhost:5000/logout', { withCredentials: true });
          navigate("/login");
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };
  return (
    <>
      {student.personal_info ? (
        <>
        {student.Payment_status!=="paid" ? <><Alert status='error'>
        <AlertIcon />
       Complete Your payment {student.Payment_status}
      </Alert></>:<></>}

        <Container maxW="container.lg" p={4}>

          
          <Box mb={6}>
            <Link  to="/">Home</Link>
            <Button  ml={10} onClick={logout} >Logout</Button>
          </Box>
          <Card mb={6}>
            <CardHeader>
              <Heading as="h1" size="lg" textAlign="center">
                Student Profile
              </Heading>
            </CardHeader>
            <CardBody>
              <Flex direction={{ base: "column", md: "column" }} align="center" mb={6}>
                {student.ID_Card && student.ID_Card.endsWith(".pdf") ? (
                  <Box width="300px" height="400px">
                    <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
                      <Viewer fileUrl={`http://localhost:5000/${student.ID_Card}`} />
                    </Worker>
                  </Box>
                ) : (
                  <Image
                    src={`http://localhost:5000/${student.ID_Card}`}
                    alt="Student ID Card"
                    borderRadius="lg"
                    mb="4"
                    objectFit="cover"
                  />
                )}
                <Button variant="solid" colorScheme="blue" ml={{ base: 0, md: 6 }} onClick={downloadIDCard}>
                  Download ID Card
                </Button>
              </Flex>
              <Divider />
              <VStack align="start" spacing={4} mt={6}>
                <HStack>
                  <Text fontWeight="bold">Username:</Text>
                  <Text>{student.username}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Name:</Text>
                  <Text>{student.personal_info.name}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Age:</Text>
                  <Text>{student.personal_info.age}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">DOB:</Text>
                  <Text>{student.personal_info.DOB}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Aadhar No:</Text>
                  <Text>{student.personal_info.Adhaar_no}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Contact No:</Text>
                  <Text>{student.personal_info.contact_no}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Course:</Text>
                  <Text>{student.course}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Payment Status:</Text>
                  <Text>{student.Payment_status}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Franchise:</Text>
                  <Text>{student.Franchise}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
          <Heading mb={4}>Certificates</Heading>
          <SimpleGrid mb={4} columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {student.Certificates &&
              student.Certificates.map((certificate, index) =>
                certificate.endsWith(".pdf") ? (
                  <Box key={index} p={5} borderWidth="1px" borderRadius="lg" boxShadow="lg">
                    <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
                      <Viewer fileUrl={`http://localhost:5000/${certificate}`} />
                    </Worker>
                    <Button
                      mt={10}
                      mb={10}
                      colorScheme="blue"
                      onClick={() => (window.location.href = `http://localhost:5000/${certificate}`)}
                    >
                      Download
                    </Button>
                  </Box>
                ) : (
                  <Box key={index} p={5} borderWidth="1px" borderRadius="lg" boxShadow="lg">
                    <Image
                      src={`http://localhost:5000/${certificate}`}
                      alt={`Certificate ${index + 1}`}
                      borderRadius="lg"
                      mb={4}
                      width="300px"
                      height="200px"
                      objectFit="cover"
                    />
                    <Button
                      colorScheme="blue"
                      onClick={() => (window.location.href = `http://localhost:5000/${certificate}`)}
                    >
                      Download
                    </Button>
                  </Box>
                )
              )}
<Spacer />
          </SimpleGrid>
                <Box mt={12} >
              <Heading mt={12} mb={4} >Test Area</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {tests? tests.map(test => (
        <div key={test._id}>
          <h2>{test.testName}</h2>
          <Button colorScheme="green" onClick={() => handleTakeTest(test._id)}>Take Test</Button>
        </div>
      )) :<>Loading</>
            }
              </SimpleGrid>
                

                </Box>


          <div>
   
    </div>
        </Container></>
        
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
};

export default ViewStudentProfile;
