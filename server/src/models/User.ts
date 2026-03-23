// Collection-User -> server\src\models\User.ts

import mongoose, { Schema, Document } from 'mongoose';

// Define los campos del usuario
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age?: number;
  weight?: number;
  height?: number;
  sex?: 'male' | 'female';
  goal?: 'lose_weight' | 'maintain' | 'gain_muscle';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  age: {
    type: Number
  },
  weight: {
    type: Number  // en kg
  },
  height: {
    type: Number  // en cm
  },
  sex: {
    type: String,
    enum: ['male', 'female']
  },
  goal: {
    type: String,
    enum: ['lose_weight', 'maintain', 'gain_muscle'],
    default: 'maintain'
  }
}, {
  timestamps: true  // agrega createdAt y updatedAt automáticamente
});

export default mongoose.model<IUser>('User', UserSchema);
