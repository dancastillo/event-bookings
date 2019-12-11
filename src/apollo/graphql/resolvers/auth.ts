import { User } from "../../../models/User";
import jwt from "jsonwebtoken";

type userInput = {
  email: string;
  password: string;
};

type createUserArgs = {
  userInput: userInput
}

export const authResolverMap = {

}
export const createUser = async (args: createUserArgs) => {
  const existingUser = await User.findOne({ email: args.userInput.email });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const user  = new User({
    email: args.userInput.email,
    password: args.userInput.password
  });

  const result = await user.save();

  return {
    ...result,
    _id: result.id,
    password: null
  };
};

export const login = async (user: userInput) => {
  const loggedInUser = await User.findOne({ email: user.email }, (err, user: any) => {
    if (err) {
      throw new Error(err);
    }
    if (!user) {
      throw new Error('User does not exist');
    }

    user.comparePassword(user.password, (err: Error, isMatch: boolean) => {
      if (err) {
        throw new Error(err.message);
      }
      if (isMatch) {
        return user;
      }
      throw new Error('Invalid email or password.');
    })
  });

  if (loggedInUser) {
    const token = jwt.sign({
        userId: loggedInUser.id,
        email: loggedInUser.email
      },
      'supersecretkey',
      {
        expiresIn: '1hr'
      });

    return {
      userId: loggedInUser.id,
      token,
      tokenExpiration: 1
    };
  }

  throw new Error('Invalid email or password.');
};
