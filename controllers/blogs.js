const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);
  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => response.status(400).end());
});

module.exports = blogsRouter;
