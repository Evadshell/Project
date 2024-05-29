import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Center,
  useColorModeValue,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  SimpleGrid,
  useToast
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { FaTrashAlt, FaUserEdit } from "react-icons/fa";
import EditStudent from "./CardComponents/EditStudent";

const ViewStudentDetails = () => {
  const [students, setStudents] = useState([]);
  const { id } = useParams();
  const tableBg = useColorModeValue("gray.50", "gray.800");
  const thBg = useColorModeValue("gray.200", "gray.700");
  const hover = useColorModeValue("gray.100", "gray.900");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
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
    idCard: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    SetIdcard(file);
  };

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
      data.append("idCard", Idcard);
    }

    try {
      await axios.post("http://localhost:5000/update", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log(error);
    }

    onEditClose();
    window.location.reload();
  };
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/studentdetail?id=${id}`,
        { withCredentials: true }
      );
      setStudents(response.data.students[0]);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, [id]);
  console.log(students);
  const download = async () => {
    window.location.href = `http://localhost:5000/download/${id}`;
  };
  const [certificates, setCertificates] = useState([]);
  const handleCertificateChange = (e) => {
    const files = Array.from(e.target.files);
    setCertificates(files);
  };

  const uploadCertificates = async () => {
    const data = new FormData();
    certificates.forEach((certificate, index) => {
      data.append(`certificates`, certificate);
    });
    data.append("studentId", students._id);

    try {
      await axios.post("http://localhost:5000/upload-certificates", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: 'Certificate uploaded',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      setCertificates([]); // Clear the file input after successful upload
      fetchStudents(); // Refresh the student details to include the newly uploaded certificates
    } catch (error) {
      console.error("Error uploading certificates:", error);
    }
  };

  return (
    <>
      {students.personal_info ? (
        <>
          <Box p={4}>
            <Link to="/franchise">Home</Link>
            <Flex mb={4}>
              <Heading as="h1" size="lg">
                Student Dashboard
              </Heading>
              <Spacer />
              <IconButton
                icon={<FaUserEdit />}
                colorScheme="blue"
                onClick={() => handleEditClick(students)}
                mr={2}
              />
              <IconButton
                icon={<FaTrashAlt />}
                colorScheme="red"
                onClick={() => handleDeleteClick(students._id)}
              />
            </Flex>
            <Center>
              {students.ID_Card && students.ID_Card.endsWith(".pdf") ? (
                <Box width="600px" height="500px">
                  <Worker
                    workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}
                  >
                    <Viewer
                      fileUrl={`http://localhost:5000/${students.ID_Card}`}
                    />
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
              <Button variant="solid" colorScheme="red" onClick={download}>
                download
              </Button>
            </Center>
            <TableContainer>
              <Table variant="striped" colorScheme="teal">
                <Thead>
                  <Tr bg={thBg}>
                    <Th>Username</Th>
                    <Th>Name</Th>
                    <Th>Age</Th>
                    <Th>DOB</Th>
                    <Th>Adhar No</Th>
                    <Th>Contact No</Th>
                    <Th>Course</Th>
                    <Th>Payment Status</Th>
                    <Th>Franchise</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr key={students.id} bg={tableBg}>
                    <Td>{students.username}</Td>
                    <Td>{students.personal_info.name}</Td>
                    <Td>{students.personal_info.age}</Td>
                    <Td>{students.personal_info.DOB}</Td>
                    <Td>{students.personal_info.Adhaar_no}</Td>
                    <Td>{students.personal_info.contact_no}</Td>
                    <Td>{students.course}</Td>
                    <Td>{students.Payment_status}</Td>
                    <Td>{students.Franchise}</Td>
                   
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
            <Button as="label" variant="solid" colorScheme="blue" mt={4}>
              Add Certificates
              <input
                type="file"
                multiple
                hidden
                onChange={handleCertificateChange}
              />
            </Button>
            <Button
              onClick={uploadCertificates}
              colorScheme="green"
              mt={4}
              ml={2}
            >
              Upload Certificates
            </Button>
          </Box>
          <Heading>Certificates :</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {students.Certificates &&
              students.Certificates.map((certificate, index) =>
                certificate.endsWith(".pdf") ? (
                  <>
            <Box key={index} p={5} borderWidth="1px" borderRadius="lg" boxShadow="lg">
                      <Worker 
                        workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}
                      >
                        <Viewer 
                          fileUrl={`http://localhost:5000/${certificate}`}
                        />
                      </Worker>
                    <Button
                    mt={4}                      colorScheme="blue"
                      onClick={() =>
                        (window.location.href = `http://localhost:5000/${certificate}`)
                      }
                    >
                      Download
                    </Button>

                    </Box>
                  </>
                ) : (
                    <Box key={index} p={5} borderWidth="1px" borderRadius="lg" boxShadow="lg">
                    <Image
                      key={index}
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
                      onClick={() =>
                        (window.location.href = `http://localhost:5000/${certificate}`)
                      }
                    >
                      Download
                    </Button>
                  </Box>
                )
              )}
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
                Are you sure you want to delete this student? This action cannot
                be undone.
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

          <EditStudent
            isEditOpen={isEditOpen}
            onEditClose={onEditClose}
            handleEditSubmit={handleEditSubmit}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            formData={formData}
          />
        </>
        ) : (
        <></>
      )}
    </>
  );
};

export default ViewStudentDetails;
