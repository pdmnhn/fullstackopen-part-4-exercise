const mongoose = require("mongoose");
const app = require("../app");
const api = require("supertest")(app);
const usersHelper = require("./usersHelper");
const bcrypt = require("bcrypt");

describe("adding invalid users should fail", () => {
  beforeEach(async () => {
    await usersHelper.clearDB();
    await usersHelper.saveInitialUsers();
  });
  test("adding an user with username less than 3 characters should fail", async () => {
    const invalidUser = {
      username: "hi",
      name: "stone",
      password: "stone's password",
    };

    await api.post("/api/users").send(invalidUser).expect(400);
    const users = (await usersHelper.usersInDB()).map((user) => {
      return { username: user.username, name: user.name };
    });
    invalidUser.passwordHash = await bcrypt.hash(
      invalidUser.password,
      usersHelper.saltRounds
    );
    delete invalidUser.password;
    expect(users).toHaveLength(usersHelper.initialUsers.length);
    expect(users).not.toContain(invalidUser);
  });

  test("adding an user with password less than 3 characters should fail", async () => {
    const invalidUser = {
      username: "douglas",
      name: "douglas adams",
      password: "hi",
    };

    await api.post("/api/users").send(invalidUser).expect(400);
    const users = (await usersHelper.usersInDB()).map((user) => {
      return { username: user.username, name: user.name };
    });
    invalidUser.passwordHash = await bcrypt.hash(
      invalidUser.password,
      usersHelper.saltRounds
    );
    delete invalidUser.password;
    expect(users).toHaveLength(usersHelper.initialUsers.length);
    expect(users).not.toContain(invalidUser);
  });

  test("adding an user without username or/and password should fail", async () => {
    const invalidUsers = [
      {
        name: "Harry Potter",
        password: "voldemort",
      },
      {
        username: "hermione",
        name: "Hermione Granger",
      },
      {
        name: "Ron",
      },
    ];

    for (const invalidUser of invalidUsers) {
      await api.post("/api/users").send(invalidUser).expect(400);
    }
    const users = await usersHelper.usersInDB();
    expect(users).toHaveLength(usersHelper.initialUsers.length);
    for (const invalidUser of invalidUsers) {
      if (invalidUser.password) {
        invalidUser.passwordHash = await bcrypt.hash(
          invalidUser.password,
          usersHelper.saltRounds
        );
      }
      delete invalidUser.password;
      expect(users).not.toContain(invalidUser);
    }
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
