import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";

import { findOne } from "./data/users.js";
import config from "./config/config.js";

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// constants
const { host, port, jwtTokenSecret } = config;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const abspath = (relpath) => {
  return join(__dirname, relpath);
};

const generateToken = (user) => {
  return jwt.sign(user, jwtTokenSecret, { expiresIn: "1800s" });
};

// middleware to handle authetication
const authenticateToken = (req, res, next) => {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  if (authHeader === undefined) {
    return res.status(401).json({ success: false, error: "Authorization header is not set" });
  }
  /*
   * Authorization header looks like: Bearer <token>
   * so split header with white space and take the second one
   */
  const token = authHeader.split(" ")[1];

  jwt.verify(token, jwtTokenSecret, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
    req.user = user;
    next();
  });
};

const app = express();

// attach middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (_req, res) => {
  res.sendFile(abspath("../public/index.html"));
});

app.get("/secret", authenticateToken, (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ success: false, error: "You are not authenticated" });
  }
});

app.post("/login", (req, res) => {
  const { userID, passwd } = req.body;
  const user = findOne(userID);
  if (!user) {
    return res.status(401).json({ success: false, error: `${userID} is not found` });
  }
  if (user.passwd !== passwd) {
    return res.status(401).json({ success: false, error: "Your password is incorrect" });
  }
  user.passwd = undefined;
  const token = generateToken(user);
  res.json({ success: true, token });
});

app.listen(port, () => {
  console.log(`http://${host}:${port}`);
});
