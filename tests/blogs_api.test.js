const mongoose = require("mongoose");
const app = require("../app");
const api = require("supertest")(app);
const Blog = require("../models/blog");
const initialBlogs = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promisesArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promisesArray);
});

test("receives blogs as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 120000);

test("receives correct amount of blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialBlogs.length);
}, 120000);

test("unique identifier field exists in each blog", async () => {
  const { body: blogs } = await api.get("/api/blogs");

  for (const blog of blogs) {
    expect(blog.id).toBeDefined();
  }
}, 120000);

test("new blog can be saved to database", async () => {
  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api.get("/api/blogs");

  const contents = response.body.map(({ title, author, likes, url }) => {
    return { title, author, likes, url };
  });

  expect(response.body).toHaveLength(initialBlogs.length + 1);

  expect(contents).toContainEqual(newBlog);
}, 120000);

test("likes defaults to zero when no likes is given in the request", async () => {
  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const { body: blogs } = await api.get("/api/blogs");

  for (const { likes } of blogs) {
    expect(likes).toBeGreaterThanOrEqual(0);
  }
}, 120000);

test("sending blogs without title and/or url fails", async () => {
  const blogs = [
    {
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 13,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 4,
    },
    { author: "Edsger W. Dijkstra", likes: 2 },
  ];

  for (const blog of blogs) {
    await api.post("/api/blogs").send(blog).expect(400);
  }
}, 120000);

afterAll(async () => await mongoose.disconnect());
