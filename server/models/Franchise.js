import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  center_name: { type: String, required: true },
  address: { type: String, required: true },
  director_name: { type: String, required: true },
  center_image: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, default: 'franchise' },
});

const Franchise = mongoose.models.Franchise || mongoose.model('Franchise', UserSchema, 'Franchise');
export default Franchise;
