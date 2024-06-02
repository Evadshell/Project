import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import { FaUserEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import EditStudent from "./EditStudent";

const StudentCards = ({ students }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const [selectedStudentId, setSelectedStudentId] = useState("");
 

  const deleteUser = async (id) => {
    console.log(id);
    onClose();
    window.location.reload();
    const response = await axios.get(
      "http://localhost:5000/deletestudent",
      { selectedStudentId },
      {
        withCredentials: true,
      }
    );
    console.log(response);
  };


  const navigate = useNavigate();

  const NavigateStudent = (id) => {
    navigate(`/student/${id}`);
  };
  const handleDeleteClick = (id) => {
    setSelectedStudentId(id);
    onOpen();
  };
  const cancelRef = React.useRef();

  return (
    <div>
      <Text fontSize="xl" mb="4">
        Total Students: {students.length}
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Name</Th>
              <Th>Age</Th>
              <Th>Date of Birth</Th>
              <Th>Adhar No</Th>
              <Th>Contact No</Th>
              <Th>Course</Th>
              <Th>Payment Status</Th>
              <Th>Franchise</Th>
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
                <Td>{student.personal_info.Adhaar_no}</Td>
                <Td>{student.personal_info.contact_no}</Td>
                <Td>{student.course}</Td>
                <Td>{student.Payment_status}</Td>
                <Td>{student.Franchise}</Td>
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
                    onClick={() => NavigateStudent(student._id)}
                    mr={2}
                  />
                  <IconButton
                    icon={<FaTrashAlt />}
                    colorScheme="red"
                    onClick={() => handleDeleteClick(student._id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this student? This action cannot be
            undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              onClick={() => deleteUser(selectedStudentId)}
              colorScheme="red"
              ml={3}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    </div>
  );
};
//TODO : add pdf for certificates,
export default StudentCards;