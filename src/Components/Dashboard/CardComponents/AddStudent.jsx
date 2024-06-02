import React, { useState } from "react";
import axios from "axios";
import {
  Button,
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
  useDisclosure,
} from "@chakra-ui/react";

const AddStudent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Idcard, SetIdcard] = useState(null);
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (Idcard) {
      data.append("idCard", Idcard); // Ensure this matches the Multer configuration
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      onClose();
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div>
      <Button onClick={onOpen} colorScheme="blue" mb="4">
        Add Student
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="add-student-form" onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Age</FormLabel>
                <Input
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Adhar No</FormLabel>
                <Input
                  name="adharNo"
                  value={formData.adharNo}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Contact No</FormLabel>
                <Input
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Course</FormLabel>
                <Input
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Payment Status</FormLabel>
                <Input
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
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
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormControl>
             
              <ModalFooter>
                <Button colorScheme="blue" type="submit">
                  Add Student
                </Button>
                <Button variant="ghost" onClick={onClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddStudent;
