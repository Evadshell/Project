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
  notice: [String],
});

// The third parameter 'Students' explicitly sets the collection name
const Admin = mongoose.model('Admin', UserSchema, 'Admin');

export default Admin;
