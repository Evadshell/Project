
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  TableContainer, 
  Heading, 
  Flex, 
  Spacer, 
  Image, 
  Center
} from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const ViewStudentDetails = () => {
  const [students, setStudents] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    
 
console.log(id)
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/studentdetail?id=${id}`,
      { withCredentials: true }
    );
      setStudents(response.data.students[0]);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  fetchStudents();
 }, [id]);
 console.log(students)
 const download = async () =>{
    window.location.href = `http://localhost:5000/download/${id}`;

 }
  return (
    <>
{students.personal_info ? (<>
    <Box p={4}>

        <Link  to="/franchise">Home</Link>
      <Flex mb={4}>
        <Heading as="h1" size="lg">Student Dashboard</Heading>
        <Spacer />
      </Flex>
      <Center>
      {students.ID_Card && students.ID_Card.endsWith('.pdf') ? (
              <Box width="600px" height="500px">
                <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
                  <Viewer fileUrl={`http://localhost:5000/${students.ID_Card}`} />
                </Worker>
              </Box>
            ) : (
              <Image
                src={`http://localhost:5000/${students.ID_Card}`}
                alt="Student profile"
                borderRadius="lg"
                mb="10"
              />
            )}  
<Button variant="solid" colorScheme='red' onClick={download}>download</Button>
      </Center>
                   <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Name</Th>
              <Th>Age</Th>
              <Th>DOB</Th>
              <Th>Adhar No</Th>
              <Th>Contact No</Th>
              <Th>Course</Th>
              <Th>Payment Status</Th>
              <Th>Franchise</Th>
              <Th>Certificates</Th>
              {/* <Th>ID Card</Th> */}
            </Tr>
          </Thead>
          <Tbody>
           
              <Tr key={students.id}>
                <Td>{students.username}</Td>
                <Td>{students.personal_info.name}</Td>
                <Td>{students.personal_info.age}</Td>
                <Td>{students.personal_info.DOB}</Td>
                <Td>{students.personal_info.Adhaar_no}</Td>
                <Td>{students.personal_info.contact_no}</Td>
                <Td>{students.course}</Td>
                <Td>{students.Payment_status}</Td>
                <Td>{students.Franchise}</Td>
                <Td>{students.Certificates}</Td>
                {/* <Td>
                  <Image src={students.idCardUrl} alt="ID Card" boxSize="100px" objectFit="cover" />
                </Td> */}
              </Tr>
           
          </Tbody>
        </Table>
      </TableContainer>
    </Box> </>):(<></>)
}
</>
  );
};

export default ViewStudentDetails;