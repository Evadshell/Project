import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Button,
  Text,
  Image,
} from "@chakra-ui/react";
import { FaTrashAlt, FaEye } from "react-icons/fa";
// import StudentCards from "./StudentCards";
import AddStudent from "./CardComponents/AddStudent";

const FranchiseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/franchise/${id}/students`, {
          withCredentials: true,
        });
        setStudents(response.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [id]);

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://localhost:5000/student/${studentId}`, {
        withCredentials: true,
      });
      setStudents(students.filter(student => student._id !== studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div>
      <Text fontSize="xl" mb="4">
        Franchise Students
      </Text>
      <AddStudent franchiseId={id} />
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Name</Th>
              <Th>Age</Th>
              <Th>Date of Birth</Th>
              <Th>Contact No</Th>
              <Th>Course</Th>
              <Th>Payment Status</Th>
              <Th>ID Card</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map((student) => (
              <Tr key={student._id}>
                <Td>{student.username}</Td>
                <Td>{student.personal_info.name}</Td>
                <Td>{student.personal_info.age}</Td>
                <Td>{student.personal_info.DOB}</Td>
                <Td>{student.personal_info.contact_no}</Td>
                <Td>{student.course}</Td>
                <Td>{student.Payment_status}</Td>
                <Td>
                  <Image
                    src={`http://localhost:5000/${student.ID_Card}`}
                    alt="ID Card"
                    boxSize="50px"
                  />
                </Td>
                <Td>
                  <IconButton
                    icon={<FaEye />}
                    colorScheme="blue"
                    onClick={() => navigate(`/student/${student._id}`)}
                    mr={2}
                  />
                  <IconButton
                    icon={<FaTrashAlt />}
                    colorScheme="red"
                    onClick={() => handleDeleteStudent(student._id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FranchiseDetails;
