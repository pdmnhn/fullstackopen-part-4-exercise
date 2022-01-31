const User = require("../models/user");
const bcrypt = require("bcrypt");
const initialUsers = [
  {
    username: "someone",
    name: "some one",
    passwordHash:
      "$2b$10$A3Um9qLJeLRHJd2XNzkXEufoRQ62A.7B3NBXespxXYJiZdfJGCFuu",
  },
  {
    username: "otherone",
    name: "other one",
    passwordHash:
      "$2b$10$BnDb/g1fMXsopT4cWj8FjeIVuDY/D5I7pQoPGrS6/C733eiWq3aLC",
  },
];

const saveInitialUsers = async () => {
  const users = initialUsers.map((user) => new User(user));
  const usersPromises = users.map((user) => user.save());
  await Promise.all(usersPromises);
};

const usersInDB = async () => {
  return await User.find({});
};

const clearDB = async () => {
  await User.deleteMany({});
};

module.exports = {
  initialUsers,
  saveInitialUsers,
  usersInDB,
  clearDB,
  saltRounds: 10,
};
