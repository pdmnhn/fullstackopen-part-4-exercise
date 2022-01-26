require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI;
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  MONGODB_URI,
  PORT,
  MONGODB_TEST_URI,
  NODE_ENV,
};
