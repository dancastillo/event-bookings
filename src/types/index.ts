export type userInput = {
  email: string;
  password: string;
};

export type createUserArgs = {
  userInput: userInput
};

export type eventInput = {
  title: any;
  description: any;
  price: string | number;
  date: any;
};

export type eventInputType = {
  eventInput: eventInput;
}

export type isAuthRequest = {
  isAuth: any;
};

export type authUser = {
  isAuth: any;
  userId: any;
};

export type eventType = {
  id: string;
}

export type bookingType = {
  id: string;
}
