import { Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
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
    Image,
  } from "@chakra-ui/react";
import {
  Box,
  Heading,
  Flex,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  VStack,
  HStack,
  Divider,
  Container,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  useToast,
} from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    ModalFooter,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import AddStudent from "../Franchise/CardComponents/AddStudent";
import { FaEye, FaTrashAlt,FaEdit } from "react-icons/fa";
const FranchiseCard = ({ Franchise }) => {
    const [name,Setid] = useState();
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        center_name: "",
        address: "",
        director_name: "",
        contact: "",
        email: "",
        center_image: null,
    });
    useEffect(()=>{
        if (Franchise) {
            setEditFormData({
                center_name: Franchise.center_name,
                address: Franchise.address,
                director_name: Franchise.director_name,
                contact: Franchise.contact,
                email: Franchise.email,
                center_image: Franchise.center_image,
            });
        }

        Setid(Franchise.center_name)
        console.log(name)
        const getstudent = async()=>{
            const response = await axios.get(`http://localhost:5000/students/${name}`, {
              withCredentials: true,
            });
            setStudents(response.data.students)
            console.log(response.data.students);
          }
          if (Franchise && Franchise.center_name) {
            getstudent();
        }
    }, [name,Franchise]);
    const handleDeleteStudent = async (studentId) => {
        try {
          await axios.delete(`http://localhost:5000/student/${studentId}`, {
            withCredentials: true,
          });
          setStudents(students.filter((student) => student._id !== studentId));
        } catch (error) {
          console.error("Error deleting student:", error);
        }
      };
      const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEditFormData({
            ...editFormData,
            center_image: file,
        });
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(editFormData).forEach((key) => {
            data.append(key, editFormData[key]);
        });

        try {
            await axios.put(`http://localhost:5000/franchise/${Franchise._id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating franchise:", error);
        }
    }
  return (
    <div>
      <Card mb={6}>
        <CardHeader>
          <Heading as="h1" size="lg" textAlign="center">
            Franchise Profile{" "}
          </Heading>
          <Button leftIcon={<FaEdit />} colorScheme="blue" onClick={() => setIsEditModalOpen(true)}>
                        Edit Franchise
                    </Button>
        </CardHeader>
        <CardBody>
          <Flex
            direction={{ base: "column", md: "column" }}
            align="center"
            mb={6}
          >
            {Franchise.ID_Card && Franchise.ID_Card.endsWith(".pdf") ? (
              <Box width="300px" height="400px">
                <Worker
                  workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}
                >
                  <Viewer
                    fileUrl={`http://localhost:5000/${Franchise.center_image}`}
                  />
                </Worker>
              </Box>
            ) : (
              <Image
                src={`http://localhost:5000/${Franchise.center_image}`}
                alt="Student ID Card"
                borderRadius="lg"
                mb="4"
                objectFit="cover"
              />
            )}
          </Flex>
          <Divider />
          <VStack align="start" spacing={4} mt={6}>
            <HStack>
              <Text fontWeight="bold">Franchise name:</Text>
              <Text>{Franchise.center_name}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">address:</Text>
              <Text>{Franchise.address}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">director_name:</Text>
              <Text>{Franchise.director_name}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">contact:</Text>
              <Text>{Franchise.contact}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">email:</Text>
              <Text>{Franchise.email}</Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
      <Text fontSize="xl" mb="4">
        Franchise Students
      </Text>
      <AddStudent  />
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
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Franchise</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form id="edit-franchise-form" onSubmit={handleEditFormSubmit}>
                            <FormControl isRequired>
                                <FormLabel>Franchise Name</FormLabel>
                                <Input name="center_name" value={editFormData.center_name} onChange={handleEditFormChange} />
                            </FormControl>
                            <FormControl isRequired mt={4}>
                                <FormLabel>Address</FormLabel>
                                <Input name="address" value={editFormData.address} onChange={handleEditFormChange} />
                            </FormControl>
                            <FormControl isRequired mt={4}>
                                <FormLabel>Director Name</FormLabel>
                                <Input name="director_name" value={editFormData.director_name} onChange={handleEditFormChange} />
                            </FormControl>
                            <FormControl isRequired mt={4}>
                                <FormLabel>Contact</FormLabel>
                                <Input name="contact" value={editFormData.contact} onChange={handleEditFormChange} />
                            </FormControl>
                            <FormControl isRequired mt={4}>
                                <FormLabel>Email</FormLabel>
                                <Input name="email" value={editFormData.email} onChange={handleEditFormChange} />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Franchise Image</FormLabel>
                                <Input name="center_image" type="file" accept="image/*" onChange={handleImageChange} />
                            </FormControl>
                            <ModalFooter>
                                <Button colorScheme="blue" type="submit">
                                    Update Franchise
                                </Button>
                                <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} ml={3}>
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
export default FranchiseCard;
