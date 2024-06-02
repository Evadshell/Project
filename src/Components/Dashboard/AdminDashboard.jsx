import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Text,
  Button,
} from "@chakra-ui/react";
import { FaEdit, FaTrashAlt, FaEye, FaPlus } from "react-icons/fa";
import EditFranchise from "./EditFranchise";
import AddFranchise from "./AddFranchise"; // AddFranchise component

const AdminDashboard = () => {
  const [franchises, setFranchises] = useState([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        const response = await axios.get("http://localhost:5000/franchises", {
          withCredentials: true,
        });
        setFranchises(response.data.franchises);
      } catch (error) {
        console.error("Error fetching franchises:", error);
      }
    };
    fetchFranchises();
  }, []);

  const handleEditClick = (id) => {
    setSelectedFranchiseId(id);
    setIsEditOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/franchise/${id}`, {
        withCredentials: true,
      });
      setFranchises(franchises.filter(franchise => franchise._id !== id));
    } catch (error) {
      console.error("Error deleting franchise:", error);
    }
  };

  const handleNavigateClick = (id) => {
    navigate(`/franchise/${id}`);
  };
  const logout = async () => {
    try {
      await axios.get('http://localhost:5000/logout', { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <div>
      <Button onClick={logout} >Logout</Button>
      <Text fontSize="xl" mb="4">
        Franchises
      </Text>
      <Button
        leftIcon={<FaPlus />}
        colorScheme="teal"
        onClick={() => setIsAddOpen(true)}
        mb={4}
      >
        Add Franchise
      </Button>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Franchise Name</Th>
              <Th>Owner</Th>
              <Th>Contact</Th>
              <Th>Location</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {franchises.map((franchise) => (
              <Tr key={franchise._id}>
                <Td>{franchise.center_name}</Td>
                <Td>{franchise.director_name}</Td>
                <Td>{franchise.contact}</Td>
                <Td>{franchise.address}</Td>
                <Td>
                  <IconButton
                    icon={<FaEye />}
                    colorScheme="blue"
                    onClick={() => handleNavigateClick(franchise._id)}
                    mr={2}
                  />
                  <IconButton
                    icon={<FaEdit />}
                    colorScheme="yellow"
                    onClick={() => handleEditClick(franchise._id)}
                    mr={2}
                  />
                  <IconButton
                    icon={<FaTrashAlt />}
                    colorScheme="red"
                    onClick={() => handleDeleteClick(franchise._id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {isEditOpen && (
        <EditFranchise
          isEditOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          franchiseId={selectedFranchiseId}
        />
      )}
      {isAddOpen && (
        <AddFranchise
          isAddOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
