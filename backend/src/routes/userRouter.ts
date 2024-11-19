import express from "express";
import { createUser, getUsers, getUserEmailIDs } from "../controllers/userController";

const userRouter = express.Router();

//Get all emailIDs
userRouter.get("/users/email", getUserEmailIDs);

// Get all users
userRouter.get("/users", getUsers);

// Create a new user
userRouter.post("/users", createUser);

export default userRouter;
