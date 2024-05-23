// User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  personal_info: {
    course: String,
    Payment_status: String,
    Franchise: String,
    ID_Card: String,
  },
  Certificates: [String],
  role: { type: String, required: true, default: 'student' }
});

// The third parameter 'Students' explicitly sets the collection name
const Users = mongoose.model('User', UserSchema, 'Student');

export default Users;
