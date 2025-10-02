import type { User } from '@fintrak/types';
import mongoose, { type Document, Schema } from 'mongoose';

export interface IUser extends Document, User {}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.authProvider === 'email';
      },
    },
    name: { type: String },
    lastName: { type: String },
    googleId: { type: String, unique: true, sparse: true }, // sparse allows null values
    profilePicture: { type: String },
    authProvider: {
      type: String,
      enum: ['email', 'google'],
      required: true,
      default: 'email',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Ensure either email/password or Google ID is provided
UserSchema.pre('save', function (next) {
  if (this.authProvider === 'email' && !this.password) {
    return next(new Error('Password is required for email authentication'));
  }
  if (this.authProvider === 'google' && !this.googleId) {
    return next(new Error('Google ID is required for Google authentication'));
  }
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
