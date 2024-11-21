import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";

import { findOne } from "./data/users.js";
import config from "./config/config.js";

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { host, port, jwtTokenSecret } = config;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const abspath = (relpath) => {
  return join(__dirname, relpath);
};

const generateToken = (user) => {
  return jwt.sign(user, jwtTokenSecret, { expiresIn: "1800s" });
};

const authenticateToken = (req, res, next) => {
  if (req.cookies.token) {
    const token = req.cookies.token;
    jwt.verify(token, jwtTokenSecret, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      req.user = user;
      return next();
    });
  } else {
    return res.status(401).json({ success: false, error: "Authorization header is not set" });
    // const authHeader = req.headers.authorization;
    // if (authHeader === undefined) {
    //   return res.status(401).json({ success: false, error: "Authorization header is not set" });
    // }
    // /*
    //  * Authorization header looks like: Bearer <token>
    //  * so split header with white space and take the second one
    //  */
    // const token = authHeader.split(" ")[1];

    // jwt.verify(token, jwtTokenSecret, (err, user) => {
    //   if (err) {
    //     return res.status(400).json({ error: err.message });
    //   }
    //   req.user = user;
    //   return next();
    // });
  }
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.sendFile(abspath("../public/index.html"));
});

app.get("/protected", authenticateToken, (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ success: false, error: "You are not authenticated" });
  }
});

app.post("/login", (req, res) => {
  const { userID, password } = req.body;
  if (!(userID && password) ) {
    return res.status(400).json({ success: false, error: "User ID or Password or both are invalid" });
  }
  const user = findOne(userID);
  if (!user) {
    return res.status(401).json({ success: false, error: `${userID} is not found` });
  }
  if (user.password !== password) {
    return res.status(401).json({ success: false, error: "Your password is incorrect" });
  }
  user.password = undefined;
  const token = generateToken(user);
  res.
    cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  .json({ success: true, token });
});

app.listen(port, () => {
  console.log(`http://${host}:${port}`);
});
