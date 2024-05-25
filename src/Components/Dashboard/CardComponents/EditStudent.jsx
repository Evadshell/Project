import React, { useState } from "react";

import {
    ModalOverlay,
    Button,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Modal,
} from "@chakra-ui/react";
const EditStudent = ({isEditOpen,handleEditSubmit,formData,handleChange,handleImageChange,onEditClose}) => {

  return (
    <div>
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
            <FormControl  mt={4}>
              <FormLabel>ID Card</FormLabel>
              <Input
                name="idCard"
                type="file"
                accept=".jpeg,.jpg,.png,.pdf"
                value={formData.Idcard}
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
  )
}

export default EditStudent
