import React, { useState, useEffect } from "react";
import {
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
  Button,
} from "@chakra-ui/react";
import axios from "axios";

const EditFranchise = ({ isEditOpen, onClose, franchiseId }) => {
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    contact: "",
    location: "",
  });

  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/franchise/${franchiseId}`, {
          withCredentials: true,
        });
        setFormData(response.data.franchise);
      } catch (error) {
        console.error("Error fetching franchise:", error);
      }
    };
    fetchFranchise();
  }, [franchiseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/franchise/${franchiseId}`, formData, {
        withCredentials: true,
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating franchise:", error);
    }
  };

  return (
    <Modal isOpen={isEditOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Franchise Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Owner</FormLabel>
            <Input
              name="owner"
              value={formData.owner}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Contact</FormLabel>
            <Input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleEditSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditFranchise;
