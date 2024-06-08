import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  HStack,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CreateTest = () => {
  const [testDetails, setTestDetails] = useState({
    testName: '',
    date: '',
    noOfQuestions: 0,
    duration: 0,
    franchise: '',
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionNo: 1,
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '',
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestDetails({ ...testDetails, [name]: value });
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({ ...currentQuestion, [name]: value });
  };

  const addQuestion = () => {
    if (questions.length >= testDetails.noOfQuestions) {
      toast({
        title: 'Limit Reached',
        description: 'You have reached the number of questions specified.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      questionNo: currentQuestion.questionNo + 1,
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: '',
    });
  };
  const navigate = useNavigate();

  const submitTest = async () => {
    const test = { ...testDetails, questions };
    try {
      await axios.post('http://localhost:5000/addTest', test);
      toast({
        title: 'Test Created',
        description: 'The test has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/franchise');
      // Clear form after submission
      setTestDetails({
        testName: '',
        date: '',
        noOfQuestions: 0,
        duration: 0,
        franchise: '',
      });
      setQuestions([]);
      setCurrentQuestion({
        questionNo: 1,
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctAnswer: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error creating the test.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="800px" mx="auto" mt={8} p={4} bg="gray.50" borderRadius="md" boxShadow="md">
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        Create New Test
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Test Name</FormLabel>
          <Input name="testName" value={testDetails.testName} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input type="date" name="date" value={testDetails.date} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>No of Questions</FormLabel>
          <Input
            type="number"
            name="noOfQuestions"
            value={testDetails.noOfQuestions}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Duration (minutes)</FormLabel>
          <Input type="number" name="duration" value={testDetails.duration} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Franchise</FormLabel>
          <Input name="franchise" value={testDetails.franchise} onChange={handleChange} />
        </FormControl>
      </VStack>
      <Divider my={6} />
      <Heading as="h2" size="lg" textAlign="center" mb={4}>
        Add Questions
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Question No</FormLabel>
          <Input name="questionNo" value={currentQuestion.questionNo} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Question</FormLabel>
          <Input name="question" value={currentQuestion.question} onChange={handleQuestionChange} />
        </FormControl>
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Option 1</FormLabel>
            <Input name="option1" value={currentQuestion.option1} onChange={handleQuestionChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Option 2</FormLabel>
            <Input name="option2" value={currentQuestion.option2} onChange={handleQuestionChange} />
          </FormControl>
        </HStack>
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Option 3</FormLabel>
            <Input name="option3" value={currentQuestion.option3} onChange={handleQuestionChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Option 4</FormLabel>
            <Input name="option4" value={currentQuestion.option4} onChange={handleQuestionChange} />
          </FormControl>
        </HStack>
        <FormControl>
          <FormLabel>Correct Answer</FormLabel>
          <Input name="correctAnswer" value={currentQuestion.correctAnswer} onChange={handleQuestionChange} />
        </FormControl>
        <Button colorScheme="teal" onClick={addQuestion} isDisabled={questions.length >= testDetails.noOfQuestions}>
          Add Question
        </Button>
      </VStack>
      <Divider my={6} />
      <Button
        colorScheme="blue"
        onClick={submitTest}
        isDisabled={questions.length < testDetails.noOfQuestions}
        width="100%"
      >
        Submit Test
      </Button>
    </Box>
  );
};

export default CreateTest;
