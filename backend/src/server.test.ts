import request from "supertest";
import mongoose from "mongoose";
import { Server } from "http";
import connectDB from "./database/db";
import { app } from "./server";

jest.mock("./database/db", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));

jest.mock("./routes/userRouter", () => ({
  __esModule: true,
  default: jest.fn((req, res, next) =>
    res.status(200).json({ message: "User Route" })
  ),
}));

jest.mock("./handlers/errorHandler", () => ({
  __esModule: true,
  errorHandler: jest.fn((err, req, res, next) =>
    res.status(500).json({ message: "Error" })
  ),
}));

jest.mock("./handlers/allRoutesHandler", () => ({
  __esModule: true,
  allRoutesHandler: jest.fn((req, res, next) =>
    res.status(404).json({ message: "Route not found" })
  ),
}));

jest.mock("./handlers/trimRequestBodyHandler", () => ({
  __esModule: true,
  trimRequestBody: jest.fn((req, res, next) => next()),
}));

describe("Express App", () => {
  let server: Server;

  beforeAll(() => {
    server = app.listen(5001);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  describe("Server Initialization", () => {
    it("should connect to the database", async () => {
      expect(connectDB).toHaveBeenCalled();
    });
  });

  describe("Valid Routes", () => {
    it("should respond with status 200 for /api route", async () => {
      const response = await request(server).get("/api/users");
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User Route");
    });
  });

  describe("Error Handling", () => {
    it("should return 404 for unknown routes", async () => {
      const response = await request(server).get("/invalid-route");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Route not found");
    });
  });
});
