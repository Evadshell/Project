import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Radio, 
  RadioGroup, 
  Stack, 
  Progress, 
  Heading, 
  Text, 
  useToast, 
  VStack, 
  Flex, 
  CircularProgress, 
  CircularProgressLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure 
} from '@chakra-ui/react';

const TakeTest = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(600); // Example: 10 minutes timer
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getTest/${testId}`);
        setTest(response.data);
        setTimer(response.data.duration * 60); // Set timer based on test duration
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };

    fetchTest();
  }, [testId]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          handleSubmit();
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const handleNextQuestion = () => {
    if (selectedOption === test.questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    const updatedQuestions = [...test.questions];
    updatedQuestions[currentQuestionIndex].selectedOption = selectedOption;
    setTest({ ...test, questions: updatedQuestions });

    setSelectedOption('');
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setSelectedOption(test.questions[currentQuestionIndex - 1].selectedOption || '');
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

 // Add to the handleSubmit function in TakeTest component
const handleSubmit = async () => {
  if (selectedOption === test.questions[currentQuestionIndex].correctAnswer) {
    setScore(score + 1);
  }

  const updatedQuestions = [...test.questions];
  updatedQuestions[currentQuestionIndex].selectedOption = selectedOption;
  setTest({ ...test, questions: updatedQuestions });

  try {
    const userId = "your-user-id"; // Replace with actual user ID
    const response = await axios.post('http://localhost:5000/testScores/submitScore', {
      userId,
      testId,
      score,
    });
    setIsSubmitted(true);
    toast({
      title: 'Test Submitted',
      description: 'Your test has been submitted successfully.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error submitting test score:', error);
  }
};

  if (!test) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <CircularProgress isIndeterminate color="green.300" />
      </Flex>
    );
  }

  if (isSubmitted || currentQuestionIndex >= test.noOfQuestions) {
    const timeTaken = test.duration * 60 - timer;

    return (
      <Box p={4}>
        <Heading as="h2" size="xl" textAlign="center" mb={6}>Test Completed</Heading>
        <Text fontSize="xl" mb={4}>Your score is {score} out of {test.noOfQuestions}</Text>
        <Text fontSize="md" mb={4}>Time taken: {Math.floor(timeTaken / 60)}:{('0' + (timeTaken % 60)).slice(-2)}</Text>
        <Heading as="h3" size="lg" mb={4}>Review your answers:</Heading>
        {test.questions.map((question, index) => (
          <Box key={index} border="1px solid gray" p="4" mb="4" borderRadius="md" bg="gray.50">
            <Text fontWeight="bold">Question {index + 1}: {question.question}</Text>
            <Text>Your answer: {question.selectedOption || 'Not answered'}</Text>
            <Text>Correct answer: {question.correctAnswer}</Text>
          </Box>
        ))}
      </Box>
    );
  }

  const question = test.questions[currentQuestionIndex];

  return (
    <Box p={4}>
      <Heading as="h2" size="xl" textAlign="center" mb={6}>{test.testName}</Heading>
      <Progress value={(currentQuestionIndex / test.noOfQuestions) * 100} mb="4" />
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg">Question {currentQuestionIndex + 1} of {test.noOfQuestions}</Text>
        <CircularProgress value={(timer / (test.duration * 60)) * 100} color="red.400">
          <CircularProgressLabel>{Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</CircularProgressLabel>
        </CircularProgress>
      </Flex>
      <Box border="1px solid gray" p="4" mb="4" borderRadius="md" bg="gray.50">
        <Text fontWeight="bold" mb={2}>Question {question.questionNo}</Text>
        <Text mb={4}>{question.question}</Text>
        <RadioGroup onChange={handleOptionChange} value={selectedOption}>
          <Stack>
            <Radio value={question.option1}>{question.option1}</Radio>
            <Radio value={question.option2}>{question.option2}</Radio>
            <Radio value={question.option3}>{question.option3}</Radio>
            <Radio value={question.option4}>{question.option4}</Radio>
          </Stack>
        </RadioGroup>
      </Box>
      <Flex justify="space-between">
        <Button colorScheme="teal" onClick={handlePreviousQuestion} isDisabled={currentQuestionIndex === 0}>Previous</Button>
        <Button colorScheme="teal" onClick={handleNextQuestion} isDisabled={!selectedOption}>Next</Button>
      </Flex>
      <Button colorScheme="red" onClick={onOpen} mt={4} width="100%">Submit</Button>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Test</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to submit the test? You cannot change your answers after submission.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleSubmit}>Submit</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TakeTest;
