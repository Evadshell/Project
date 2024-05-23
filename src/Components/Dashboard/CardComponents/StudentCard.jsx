import React, { useState } from 'react';

  import {
  Card, CardBody, Image, Stack, Heading, Text, Divider, CardFooter, ButtonGroup, Button, SimpleGrid, useDisclosure,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea
} from '@chakra-ui/react';
  import axios from 'axios';
const StudentCards = ({ students }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    const [selectedStudentId, setSelectedStudentId] = useState('');

    const deleteUser = async (id) => {
      console.log(id);onClose();
      // Here you would typically call your backend to delete the user
      window.location.reload();
      const response = await axios.get("http://localhost:5000/deletestudent", {selectedStudentId},{
        withCredentials: true,
      });
      console.log(response)

      
    };
  
    const handleDeleteClick = (id) => {
      setSelectedStudentId(id);
      onOpen();
    };
  return (
    <div>
      <Text fontSize="xl" mb="4">
        Total Students: {students.length}
      </Text>
      <SimpleGrid columns={[1, 2, 3]} spacing="6">
        {students.map((student) => (
            <>
          <Card key={student._id} maxW='sm'>
            <CardBody>
              <Image
                src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                alt='Student profile'
                borderRadius='lg'
              />
              <Stack mt='6' spacing='3'>
                <Heading size='md'>{student.personal_info.name}</Heading>
                <Text>
                  Age: {student.personal_info.age}
                </Text>
                <Text>
                  Course: {student.course}
                </Text>
                <Text color='blue.600' fontSize='2xl'>
                  Payment Status: ${student.Payment_status}
                </Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
              <ButtonGroup spacing='2'>
              <Button variant='solid' colorScheme='blue' onClick={() => handleEditClick(student)}>
                  Edit Details
                </Button>
                <Button variant='solid' onClick={() => handleDeleteClick(student._id)} colorScheme='red'>
                  Delete Student
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
          </>
        ))}
      </SimpleGrid>
          <AlertDialog
        motionPreset='slideInBottom'
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
            Are you sure you want to delete this student? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button onClick={() => deleteUser(selectedStudentId)} colorScheme='red' ml={3}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
     
      {selectedStudent && (
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Student Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input name="username" value={selectedStudent.username} onChange={handleChange} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <Input name="password" type="password" value={selectedStudent.password} onChange={handleChange} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Name</FormLabel>
                <Input name="personal_info.name" value={selectedStudent.personal_info.name} onChange={handleChange} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Age</FormLabel>
                <Input name="personal_info.age" value={selectedStudent.personal_info.age} onChange={handleChange} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Date of Birth</FormLabel>
                <Input name="personal_info.DOB" value={selectedStudent.personal_info.DOB} onChange={handleChange} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Aadhar No</FormLabel>
                <Input name="personal_info.Adhaar_no" value={selectedStudent.personal_info.Adhaar_no} onChange={handleChange} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Contact No</FormLabel>
                <Input name="personal_info.contact_no" value={selectedStudent.personal_info.contact_no} onChange={handleChange} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Course</FormLabel>
                <Input name="course" value={selectedStudent.course} onChange={handleChange} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Payment Status</FormLabel>
                <Input name="Payment_status" value={selectedStudent.Payment_status} onChange={handleChange} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Franchise</FormLabel>
                <Input name="Franchise" value={selectedStudent.Franchise} onChange={handleChange} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>ID Card</FormLabel>
                <Input name="ID_Card" value={selectedStudent.ID_Card} onChange={handleChange} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleEditSubmit}>
                Save
              </Button>
              <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default StudentCards;
