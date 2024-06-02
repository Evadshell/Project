import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, FormControl, FormLabel } from '@chakra-ui/react';

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
    questionNo: 0,
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestDetails({ ...testDetails, [name]: value });
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({ ...currentQuestion, [name]: value });
  };

  const addQuestion = () => {
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

  const submitTest = async () => {
    const test = { ...testDetails, questions };
    await axios.post('http://localhost:5000/addTest', test);
    // handle success or error
  };

  return (
    <div>
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
        <Input name="noOfQuestions" value={testDetails.noOfQuestions} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Duration (minutes)</FormLabel>
        <Input name="duration" value={testDetails.duration} onChange={handleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Franchise</FormLabel>
        <Input name="franchise" value={testDetails.franchise} onChange={handleChange} />
      </FormControl>

      <div>
        <FormControl>
          <FormLabel>Question No</FormLabel>
          <Input name="questionNo" value={currentQuestion.questionNo} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Question</FormLabel>
          <Input name="question" value={currentQuestion.question} onChange={handleQuestionChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Option 1</FormLabel>
          <Input name="option1" value={currentQuestion.option1} onChange={handleQuestionChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Option 2</FormLabel>
          <Input name="option2" value={currentQuestion.option2} onChange={handleQuestionChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Option 3</FormLabel>
          <Input name="option3" value={currentQuestion.option3} onChange={handleQuestionChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Option 4</FormLabel>
          <Input name="option4" value={currentQuestion.option4} onChange={handleQuestionChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Correct Answer</FormLabel>
          <Input name="correctAnswer" value={currentQuestion.correctAnswer} onChange={handleQuestionChange} />
        </FormControl>
        <Button onClick={addQuestion}>Add Question</Button>
      </div>

      <Button onClick={submitTest}>Submit Test</Button>
    </div>
  );
};

export default CreateTest;
