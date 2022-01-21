const countBy = require("lodash/countBy");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (likes, post) => {
    return likes + post.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (previous, current) => {
    return previous.likes > current.likes ? previous : current;
  };

  const result = blogs.reduce(reducer, {});
  delete result._id;
  delete result.__v;
  delete result.url;
  return result;
};

const mostBlogs = (blogs) => {
  const authorCount = countBy(blogs, (blog) => blog.author);
  const result = {};
  for (const author in authorCount) {
    if (!(authorCount[author] < result.blogs)) {
      result.author = author;
      result.blogs = authorCount[author];
    }
  }

  return result;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const authorLikes = {};
  for (const { author, likes } of blogs) {
    if (authorLikes.hasOwnProperty(author)) {
      authorLikes[author] += likes;
    } else {
      authorLikes[author] = likes;
    }
  }

  const reducer = (prev, curr) => {
    return authorLikes[prev] > authorLikes[curr] ? prev : curr;
  };

  const authorWithMaxLikes = Object.keys(authorLikes).reduce(reducer);

  return { author: authorWithMaxLikes, likes: authorLikes[authorWithMaxLikes] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
