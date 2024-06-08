import React, { useState, useEffect } from "react";
import { Box, Text, Image, Button, Center } from "@chakra-ui/react";

const NoticeDisplay = ({ notices }) => {
  const [currentIndex, setCurrentIndex] = useState(notices.length - 1);

  useEffect(() => {
    setCurrentIndex(notices.length - 1);
  }, [notices.length]);

  const  handleNext= () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : notices.length - 1));
  };

  const  handlePrevious= () => {
    setCurrentIndex((prevIndex) => (prevIndex < notices.length - 1 ? prevIndex + 1 : 0));
  };

  if (notices.length === 0) {
    return <Text>No notices available</Text>;
  }

  const currentNotice = notices[currentIndex];

  if (!currentNotice) {
    return <Text>No notice to display</Text>;
  }

  return (
    <Box>
      <Center>
        {currentNotice.text && <Box p="4" borderWidth="1px" borderRadius="md">{currentNotice.text}</Box>}
        {currentNotice.image && <Image src={`http://localhost:5000/${currentNotice.image}`} alt="Notice" />}
      </Center>
      <Center mt="4">
        <Button onClick={handlePrevious} mr="4">
          Previous
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </Center>
    </Box>
  );
};

export default NoticeDisplay;
