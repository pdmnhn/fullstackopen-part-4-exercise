const jwt = require("jsonwebtoken");
const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:", request.path);
  logger.info("Body:", request.body);
  logger.info("---");
  next();
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    request.user = null;
  } else {
    request.user = jwt.decode(request.token, process.env.SECRET);
  }
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.code === 11000) {
    response.status(400).send({ error: "user already exists" });
  } else if (error.name === "CastError") {
    response.status(400).send({ error: "invalid id" });
  }
  logger.error(error.message);
  next(error);
};

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
