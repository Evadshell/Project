// AddNotice.js
import React, { useState } from "react";
import { Button, Input, FormControl, FormLabel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import axios from "axios";

const AddNotice = ({ isOpen, onClose }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleTextChange = (e) => setText(e.target.value);
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("http://localhost:5000/notices", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      onClose();
    } catch (error) {
      console.error("Error adding notice:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Notice</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Text</FormLabel>
            <Input type="text" value={text} onChange={handleTextChange} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Image</FormLabel>
            <Input type="file" onChange={handleImageChange} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Add Notice
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddNotice;
