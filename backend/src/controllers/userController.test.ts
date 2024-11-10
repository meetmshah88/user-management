import { createUser, getUsers } from "../controllers/userController";
import { Request, Response, NextFunction } from "express";
import { validatedCreateUserData } from "../util/validation";
import { isValidName, isValidEmail } from "../util/validation";
import { throwError } from "../util/error";
import User from "../models/User";

jest.mock("../util/validation", () => ({
  validatedCreateUserData: jest.fn(),
  isValidName: jest.fn(),
  isValidEmail: jest.fn(),
}));

jest.mock("../util/error", () => ({
  throwError: jest.fn(),
}));

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn().mockReturnThis(),
}));

describe("User Controller Tests", () => {
  describe("createUser Controller", () => {
    it("should return 400 if input validation fails", async () => {
      const req = {
        body: { firstName: "John", lastName: "Doe", emailId: "invalid email" },
      } as Request;
      const res = {} as Response;
      const next = jest.fn();

      // Mock return values for validation functions
      (validatedCreateUserData as jest.Mock).mockReturnValue(true);
      (isValidName as jest.Mock).mockReturnValue(true);
      (isValidEmail as jest.Mock).mockReturnValue(false);

      await createUser(req, res, next);

      expect(throwError).toHaveBeenCalledWith("Bad Request", 400);

      expect(next).toHaveBeenCalled();
    });

    it("should return 400 if the user already exists", async () => {
      const req = {
        body: {
          firstName: "Jane",
          lastName: "Doe",
          emailId: "john.doe@example.com",
        },
      } as Request;
      const res = {} as Response;
      const next = jest.fn();

      // Mock return values for validation functions
      (validatedCreateUserData as jest.Mock).mockReturnValue(true);
      (isValidName as jest.Mock).mockReturnValue(true); // Valid name
      (isValidEmail as jest.Mock).mockReturnValue(true); // Valid email

      // Mock user search (simulate DB lookup)
      const existingUser = { emailId: "john.doe@example.com" };
      (User.findOne as jest.Mock).mockReturnValue(existingUser);

      await createUser(req, res, next);

      expect(throwError).toHaveBeenCalledWith("User is already exist", 400);

      expect(next).toHaveBeenCalled();
    });

    it("should return 400 if the first name is invalid", async () => {
      const req = {
        body: {
          firstName: "John123",
          lastName: "Doe",
          emailId: "john.doe@example.com",
        },
      } as Request;
      const res = {} as Response;
      const next = jest.fn();

      // Mock return values for validation functions
      (validatedCreateUserData as jest.Mock).mockReturnValue(true);
      (isValidName as jest.Mock).mockReturnValue(false); // Invalid first name
      (isValidEmail as jest.Mock).mockReturnValue(true); // Valid email

      await createUser(req, res, next);

      // Verify that throwError was called with the expected error
      expect(throwError).toHaveBeenCalledWith("Bad Request", 400);

      expect(next).toHaveBeenCalled();
    });

    it("should return 400 if required fields are missing", async () => {
      const req = {
        body: { firstName: "", lastName: "", emailId: "" },
      } as Request;
      const res = {} as Response;
      const next = jest.fn();

      // Mock return values for validation functions
      (validatedCreateUserData as jest.Mock).mockReturnValue(false);

      await createUser(req, res, next);

      expect(throwError).toHaveBeenCalledWith("Bad Request", 400);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("getUsers Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn(),
        json: jest.fn(),
      } as Partial<Response>;
      next = jest.fn();
    });

    it("should return a list of users when users are found", async () => {
      const mockUsers = [
        {
          _id: "1",
          firstName: "John",
          lastName: "Doe",
          emailId: "john@example.com",
          createdAt: Date.now(),
        },
        {
          _id: "2",
          firstName: "Jane",
          lastName: "Doe",
          emailId: "jane@example.com",
          createdAt: Date.now() + 10,
        },
      ];

      (User.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockUsers),
      });

      await getUsers(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return an empty list if no users are found", async () => {
      (User.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      await getUsers(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith([]);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with an error if User.find throws an error", async () => {
      const error = new Error("Database error");
      (User.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockRejectedValue(error),
      });

      await getUsers(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
