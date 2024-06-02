// User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  registration_no:{
    type:String,
required:true,
unique:true
  },
  password: {
    type: String,
    required: true,
  },
  personal_info: {
    name:String,
    Qualification:Array,
    age:String,

        DOB:String,
        contact_no:String,
            Adress:String,
        Adhaar_no:String,
        Adhaar_photo:String,
   
  },
   course: String,
    Payment_status: String,
    Franchise: String,
    ID_Card: String,
  Certificates: [String],
  role: { type: String, required: true, default: 'student' }
});

// The third parameter 'Students' explicitly sets the collection name
const Users = mongoose.model('User', UserSchema, 'Student');

export default Users;
