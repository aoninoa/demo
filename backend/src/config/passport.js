import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { findOne } from "../data/users.js";

const localStrategy = new LocalStrategy(
  {
    usernameField: "userID",
    passwordField: "password",
  },
  async (userID, password, done) => {
    try {
      console.log(userID, password);
      const user = await findOne(userID);
      if (!user) {
        return done(null, false);
      }
      if (user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);

passport.use(localStrategy);

export default passport;
