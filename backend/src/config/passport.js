import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";

import { findOne } from "../data/users.js";
import config from "../config/config.js";

const localStrategy = new LocalStrategy(
  {
    usernameField: "userID",
    passwordField: "password",
  },
  async (userID, password, done) => {
    try {
      const user = await findOne(userID);
      if (!user) {
        return done(new Error(`${userID} is not found`), false);
      }
      if (user.password !== password) {
        return done(new Error("Provided password is incorrect"), false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);

const extractCookie = (req) => {
  if (req && req.cookies) {
    return req.cookies.token;
  }
  return null;
};

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: extractCookie,
    secretOrKey: config.jwtTokenSecret,
  },
  (user, done) => {
    return done(null, user);
  }
);

passport.use(localStrategy);
passport.use(jwtStrategy);

export default passport;
