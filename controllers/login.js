const loginRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;
  if (!(username && password)) {
    return response.status(400).send({ error: "missing details to login" });
  }
  const { passwordHash, id, name } = await User.findOne({ username });
  const success = await bcrypt.compare(password, passwordHash);
  if (!success) {
    return response.status(401);
  }
  const userForToken = { username, id };
  const token = jwt.sign(userForToken, process.env.SECRET);

  response.status(200).send({ username, name, token });
});

module.exports = loginRouter;
