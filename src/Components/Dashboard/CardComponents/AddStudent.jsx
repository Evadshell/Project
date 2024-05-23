import React, {  useState } from "react";
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
} from '@chakra-ui/react';
const AddStudent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      name: '',
      age: '',
      dob: '',
      adharNo: '',
      contactNo: '',
      course: '',
      paymentStatus: '',
      franchise: '',
      idCard: ''
    });
    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/register', formData);
          console.log(response.data);
          // Optionally refresh the student list or show a success message
          onClose();
        } catch (error) {
          console.error('Error registering user:', error);
        }
      };
  return (
    <div>
            <Button onClick={onOpen} colorScheme='blue' mb='4'>Add Student</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="add-student-form" onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input name="username" value={formData.username} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Password</FormLabel>
                <Input name="password" type="password" value={formData.password} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Name</FormLabel>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Age</FormLabel>
                <Input name="age" value={formData.age} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Date of Birth</FormLabel>
                <Input name="dob" value={formData.dob} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Adhar No</FormLabel>
                <Input name="adharNo" value={formData.adharNo} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Contact No</FormLabel>
                <Input name="contactNo" value={formData.contactNo} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Course</FormLabel>
                <Input name="course" value={formData.course} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Payment Status</FormLabel>
                <Input name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Franchise</FormLabel>
                <Input name="franchise" value={formData.franchise} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>ID Card</FormLabel>
                <Input name="idCard" value={formData.idCard} onChange={handleChange} />
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' type="submit" form="add-student-form">
              Add Student
            </Button>
            <Button variant='ghost' onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default AddStudent
