jest.mock("../User", () => {
  const mockUser = {
    save: jest.fn().mockResolvedValue({
      _id: "123",
      firstName: "Meet",
      lastName: "Shah",
      emailId: "meetshah@example.com",
    }),
    find: jest.fn().mockResolvedValue([
      {
        _id: "1",
        emailId: "meetshah@example.com",
        firstName: "Meet",
        lastName: "Shah",
      },
      {
        _id: "2",
        emailId: "nisargshah@example.com",
        firstName: "Nisarg",
        lastName: "Shah",
      },
    ]),
    findOne: jest.fn().mockResolvedValue({
      _id: "1",
      firstName: "Meet",
      lastName: "Shah",
      emailId: "meetshah@example.com",
    }),
  };

  return {
    ...mockUser,
    Model: jest.fn().mockImplementation(() => mockUser),
  };
});

import User from "../User";

describe("User Model", () => {
  it("should retrieve all users", async () => {
    const users = await User.find();

    expect(users.length).toBe(2);
    expect(users[0].emailId).toBe("meetshah@example.com");
    expect(users[1].emailId).toBe("nisargshah@example.com");
    expect(User.find).toHaveBeenCalled();
  });

  it("should find a user by emailId", async () => {
    const user = await User.findOne({ emailId: "meetshah@example.com" });

    expect(user).toHaveProperty("_id");
    expect(user?.emailId).toBe("meetshah@example.com");
    expect(User.findOne).toHaveBeenCalled();
  });
});
