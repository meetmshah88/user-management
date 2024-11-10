jest.mock("./User", () => {
  const mockUser = {
    save: jest.fn().mockResolvedValue({
      _id: "123",
      firstName: "John",
      lastName: "Doe",
      emailId: "john.doe@example.com",
    }),
    find: jest.fn().mockResolvedValue([
      {
        _id: "1",
        emailId: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
      },
      {
        _id: "2",
        emailId: "jane.doe@example.com",
        firstName: "Jane",
        lastName: "Doe",
      },
    ]),
    findOne: jest.fn().mockResolvedValue({
      _id: "1",
      firstName: "John",
      lastName: "Doe",
      emailId: "john.doe@example.com",
    }),
  };

  return {
    ...mockUser,
    Model: jest.fn().mockImplementation(() => mockUser),
  };
});

import User from "../models/User";

describe("User Model", () => {
  it("should retrieve all users", async () => {
    const users = await User.find();

    expect(users.length).toBe(2);
    expect(users[0].emailId).toBe("john.doe@example.com");
    expect(users[1].emailId).toBe("jane.doe@example.com");
    expect(User.find).toHaveBeenCalled();
  });

  it("should find a user by emailId", async () => {
    const user = await User.findOne({ emailId: "john.doe@example.com" });

    expect(user).toHaveProperty("_id");
    expect(user?.emailId).toBe("john.doe@example.com");
    expect(User.findOne).toHaveBeenCalled();
  });
});
