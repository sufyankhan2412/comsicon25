import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['manager', 'team_member'],
    default: 'team_member'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default model('User', UserSchema);