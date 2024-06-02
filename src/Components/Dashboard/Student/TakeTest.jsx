import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

const TakeTest = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getTest/${testId}`);
        setTest(response.data);
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };

    fetchTest();
  }, [testId]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedOption === test.questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    setSelectedOption('');
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  if (!test) return <div>Loading...</div>;

  if (currentQuestionIndex >= test.noOfQuestions) {
    return <div>Your score is {score} out of {test.noOfQuestions}</div>;
  }

  const question = test.questions[currentQuestionIndex];

  return (
    <div>
      <h2>{test.testName}</h2>
      <p>Question {question.questionNo}</p>
      <p>{question.question}</p>
      <div>
        <input
          type="radio"
          value={question.option1}
          checked={selectedOption === question.option1}
          onChange={handleOptionChange}
        /> {question.option1}
      </div>
      <div>
        <input
          type="radio"
          value={question.option2}
          checked={selectedOption === question.option2}
          onChange={handleOptionChange}
        /> {question.option2}
      </div>
      <div>
        <input
          type="radio"
          value={question.option3}
          checked={selectedOption === question.option3}
          onChange={handleOptionChange}
        /> {question.option3}
      </div>
      <div>
        <input
          type="radio"
          value={question.option4}
          checked={selectedOption === question.option4}
          onChange={handleOptionChange}
        /> {question.option4}
      </div>
      <Button onClick={handleNextQuestion}>Next</Button>
    </div>
  );
};

export default TakeTest;
