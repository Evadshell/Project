import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionNo: { type: Number, required: true },
  question: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
  option4: { type: String, required: true },
  correctAnswer: { type: String, required: true },
});

const TestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  date: { type: Date, required: true },
  noOfQuestions: { type: Number, required: true },
  questions: [QuestionSchema],
  duration: { type: Number, required: true },
  franchise: { type: String, required: true },
});

const Test = mongoose.model('Test', TestSchema);
export default Test;
