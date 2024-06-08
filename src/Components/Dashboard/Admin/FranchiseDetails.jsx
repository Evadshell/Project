import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FranchiseCard from "./FranchiseCard";
const FranchiseDetails = () => {
  const { id } = useParams();
  const [Franchise, SetFranchise] = useState();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/franchise/${id}`,
          {
            withCredentials: true,
          }
        );
        SetFranchise(response.data.franchise[0]);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [id]);



  return (
    <div>
      <h1>About Franchise</h1>
      {Franchise ? (
        <>
          <FranchiseCard Franchise={Franchise} />
        </>
      ) : (
        <>
          <h1>Loading</h1>
        </>
      )}
    </div>
  );
};

export default FranchiseDetails;
