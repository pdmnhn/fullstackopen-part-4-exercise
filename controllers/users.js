const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    likes: 1,
    author: 1,
  });
  response.status(200).json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!username || !password) {
    return response
      .status(400)
      .send({ error: "missing detail(s) to create a new user" });
  } else if (username.length < 3) {
    return response
      .status(400)
      .send({ error: "username must have atleast 3 characters" });
  } else if (password.length < 3) {
    return response
      .status(400)
      .send({ error: "password must have atleast 3 characters" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({ username, name, passwordHash });
  await newUser.save();
  response.status(201).json(newUser);
});

module.exports = usersRouter;
