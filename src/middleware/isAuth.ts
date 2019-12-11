import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = <string>req.headers.authorization;

  try {
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>
    let decodedToken;
    decodedToken = jwt.verify(token, 'somesupersecretkey');

    req = {
      ...req,
      // @ts-ignore
      isAuth: false,
      // @ts-ignore
      userId: decodedToken.userId
    };
    next();

    }
  } catch (err) {
    // @ts-ignore
    req = { ...req, isAuth: false };
    return next();
  }

};
