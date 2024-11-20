import dotenv from "dotenv";

dotenv.config();

export default {
  jwtTokenSecret: process.env.TOKEN_SECRET,
  port: process.env.PORT ?? 8080,
  host: process.env.HOST ?? "localhost",
};
