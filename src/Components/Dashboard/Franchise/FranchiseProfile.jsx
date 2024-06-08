import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Image,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Divider,
  useToast,
} from '@chakra-ui/react';

const FranchiseProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [franchise, setFranchise] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/franchise/${id}`, {
          withCredentials: true,
        });
        setFranchise(response.data.franchise);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error fetching franchise details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchFranchise();
  }, [id, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFranchise((prevFranchise) => ({
      ...prevFranchise,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('username', franchise.username);
    formData.append('password', franchise.password);
    formData.append('center_name', franchise.center_name);
    formData.append('address', franchise.address);
    formData.append('director_name', franchise.director_name);
    formData.append('contact', franchise.contact);
    formData.append('email', franchise.email);
    if (imageFile) {
      formData.append('center_image', imageFile);
    }

    try {
      await axios.put(`http://localhost:5000/franchise/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Franchise details updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error updating franchise details',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box maxW="800px" mx="auto" mt={8} p={4}>
      <Card>
        <CardHeader>
          <Heading size="lg">Franchise Profile</Heading>
        </CardHeader>
        <Divider />
        <CardBody>
          {isEditing ? (
            <VStack spacing={4}>
             
              <FormControl>
                <FormLabel>Center Name</FormLabel>
                <Input
                  name="center_name"
                  value={franchise.center_name || ''}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  value={franchise.address || ''}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Director Name</FormLabel>
                <Input
                  name="director_name"
                  value={franchise.director_name || ''}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Contact</FormLabel>
                <Input
                  name="contact"
                  value={franchise.contact || ''}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={franchise.email || ''}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Center Image</FormLabel>
                <Input
                  type="file"
                  name="center_image"
                  onChange={handleFileChange}
                />
              </FormControl>
              {franchise.center_image && (
                <Image src={`http://localhost:5000/${franchise.center_image}`} alt="Franchise" boxSize="150px" />
              )}
              <HStack spacing={4} mt={4}>
                <Button colorScheme="blue" onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={handleEditToggle}>Cancel</Button>
              </HStack>
            </VStack>
          ) : (
            <VStack spacing={4}>
              {franchise.center_image && (
                <Image src={`http://localhost:5000/${franchise.center_image}`} alt="Franchise" boxSize="150px" />
              )}
              <Text><b>Username:</b> {franchise.username}</Text>
              <Text><b>Center Name:</b> {franchise.center_name}</Text>
              <Text><b>Address:</b> {franchise.address}</Text>
              <Text><b>Director Name:</b> {franchise.director_name}</Text>
              <Text><b>Contact:</b> {franchise.contact}</Text>
              <Text><b>Email:</b> {franchise.email}</Text>
              <Button colorScheme="blue" onClick={handleEditToggle}>Edit</Button>
            </VStack>
          )}
          <Button mt={4} variant="outline" onClick={handleBack}>Back</Button>
        </CardBody>
      </Card>
    </Box>
  );
};

export default FranchiseProfile;
