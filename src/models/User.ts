import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
  createdEvents?: mongoose.Schema.Types.ObjectId;
  _doc?: any;
}

type userLogin = {
  email: string;
  password: string;
};

type comparePasswordFunction = (userLogin: userLogin) => void;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event '
    }
  ]
}, { timestamps: true });

/**
 * Password hash middleware
 */
userSchema.pre("save", async function save(next) {
  const user = this as UserDocument;
  if (!user.isModified("password")) {
    return next();
  }

  user.password = await bcrypt.hash(user.password, 12);
  next();
});

const comparePassword: comparePasswordFunction = async function (userLogin: userLogin) {
  const user = await User.findOne({ email: userLogin.email });

  if (!user) {
    throw new Error('User does not exist');
  }

  const isEqual = await bcrypt.compare(userLogin.password, user.password);

  if (isEqual) {
    throw new Error('Password is incorrect');
  }
};

userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<UserDocument>("User", userSchema);
