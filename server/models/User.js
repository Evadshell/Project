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
});

// Method to compare password
UserSchema.methods.comparePassword = function(candidatePassword) {
  return candidatePassword === this.password;
};

const Users = mongoose.model('Users', UserSchema);

export default Users;