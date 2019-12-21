import express from "express";
import bodyParser from "body-parser";
import bluebird from "bluebird";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";

import { createServer } from "http";
import { MONGODB_URI } from "./utils/secrets";
import { apolloServer } from "./apollo";
// import { isAuth } from "./middleware/isAuth";

const app = express();
export const port = process.env.PORT || 3000;


// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

// @ts-ignore
mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch((err: string) => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  process.exit();
});

app.set("port", port);
app.use('*', cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// TODO: Set up isAuth middleware.
// app.use(isAuth);

apolloServer.applyMiddleware({app, path: '/apollo'});

const httpServer = createServer(app);

export default httpServer;
