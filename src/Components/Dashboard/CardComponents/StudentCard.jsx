import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
const StudentCards = ({ students }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const cancelRef = React.useRef();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [Idcard, SetIdcard] = useState(null);
  const [formData, setFormData] = useState({
    _id: "",
    username: "",
    password: "",
    name: "",
    age: "",
    dob: "",
    adharNo: "",
    contactNo: "",
    course: "",
    paymentStatus: "",
    franchise: "",
  });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    SetIdcard(file);
  };

  const deleteUser = async (id) => {
    console.log(id);
    onClose();
    // Here you would typically call your backend to delete the user
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
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleDeleteClick = (id) => {
    setSelectedStudentId(id);
    onOpen();
  };
  const handleEditClick = (student) => {
    setFormData({
      _id: student._id,
      username: student.username,
      password: "",
      name: student.personal_info.name,
      age: student.personal_info.age,
      dob: student.personal_info.DOB,
      adharNo: student.personal_info.Adhaar_no,
      contactNo: student.personal_info.contact_no,
      course: student.course,
      paymentStatus: student.Payment_status,
      franchise: student.Franchise,
      idCard: student.ID_Card,
    });
    onEditOpen();
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (Idcard) {
      data.append("idCard", Idcard); // Ensure this matches the Multer configuration
    }
    try {
       await axios.post("http://localhost:5000/update", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    } catch (error) {
      console.log(error)
    }
   
    onEditClose();
    window.location.reload();
  };
  const navigate = useNavigate();

  const NavigateStudent = (id)=>{
    navigate(`/student/${id}`);
  }
  return (
    <div>
      <Text fontSize="xl" mb="4">
        Total Students: {students.length}
      </Text>
      <SimpleGrid columns={[1, 2, 3]} spacing="6">
        {students.map((student) => (
          <>
            <Card key={student._id} maxW="sm">
              <CardBody>
                <Image
                  src={`http://localhost:5000/${student.ID_Card}`}
                  alt="Student profile"
                  borderRadius="lg"
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">{student.personal_info.name}</Heading>
                  <Text>Age: {student.personal_info.age}</Text>
                  <Text>Course: {student.course}</Text>
                  <Text color="blue.600" fontSize="2xl">
                    Payment Status: ${student.Payment_status}
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="2">
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    onClick={() => handleEditClick(student)}
                  >
                    Edit Details
                  </Button>
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    onClick={() => NavigateStudent(student._id)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="solid"
                    onClick={() => handleDeleteClick(student._id)}
                    colorScheme="red"
                  >
                    Delete Student
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          </>
        ))}
      </SimpleGrid>
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

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Student Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Age</FormLabel>
              <Input
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Adhar No</FormLabel>
              <Input
                name="adharNo"
                value={formData.adharNo}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Contact No</FormLabel>
              <Input
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Course</FormLabel>
              <Input
                name="course"
                value={formData.course}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Payment Status</FormLabel>
              <Input
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Franchise</FormLabel>
              <Input
                name="franchise"
                value={formData.franchise}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>ID Card</FormLabel>
              <Input
                name="idCard"
                type="file"
                accept=".jpeg,.jpg,.png,.pdf"
                onChange={handleImageChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditSubmit}>
              Save
            </Button>
            <Button variant="ghost" onClick={onEditClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StudentCards;
