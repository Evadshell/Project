// User.js
import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  text: String,
  image: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

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
  notices: [NoticeSchema],
});

const Admin = mongoose.model('Admin', UserSchema, 'Admin');

export default Admin;
