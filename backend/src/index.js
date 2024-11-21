import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";

import config from "./config/config.js";
import passport from "./config/passport.js";

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
  
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", passport.authenticate("jwt", { session: false, successRedirect: "/protected", failureRedirect: "/login" }), (req, res) => {
  // if (req.user) {
  //   res.redirect("/protected");
  // } else {
  //   res.redirect("/login");
  // }
});

app.get("/protected", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json(req.user);
});

app.get("/logout", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

app.get("/login", (_req, res) => {
  res.sendFile(abspath("../public/index.html"));
});

app.post("/login", (req, res) => {
  passport.authenticate("local", { session: false }, (error, user) => {
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    if (!user) {
      return res.status(401).json({ success: false, error: "Authetication failed" });
    }
    delete user.password;
    const token = generateToken(user);
    return res
      .cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .json({ success: true, token });
  })(req, res);
});

app.listen(port, () => {
  console.log(`http://${host}:${port}`);
});
