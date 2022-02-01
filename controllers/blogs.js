const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.status(200).json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const { id } = request.params;
  const blog = await Blog.findById(id).populate("user", {
    username: 1,
    name: 1,
  });
  if (!blog) {
    return response.status(404).send({ error: "blog not found" });
  }
  response.status(200).json(blog);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.user) {
    return response.status(401).end();
  }
  const { username, id } = request.user;
  const { title, url, likes } = request.body;
  if (!(url && title)) {
    return response
      .status(400)
      .send({ error: "url and title are required for creating a blog" });
  }
  const blogObj = {
    title,
    author: username,
    url,
    likes,
    user: id,
  };
  const blog = new Blog(blogObj);
  const result = await blog.save();
  let user = await User.findById(id);
  user.blogs = user.blogs.concat(result.id);
  await user.save();
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(404).end();
  } else if (!(request.user && request.user.id === blog.user.toString())) {
    return response.status(401).end();
  }
  await blog.delete();
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };
  const result = await Blog.findByIdAndUpdate(id, blog, { new: true });
  response.status(200).json(result);
});

module.exports = blogsRouter;
