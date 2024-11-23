import express from "express";
import { createUser, getUsers, getUserEmailIDs, usersSeedings, usersUnseeded } from "../controllers/userController";

const userRouter = express.Router();

//Get all emailIDs
userRouter.get("/users/email", getUserEmailIDs);

//Seeding users
userRouter.post("/users/seeds", usersSeedings);

//Removing Users
userRouter.delete("/users/unseeds", usersUnseeded);

// Get all users
userRouter.get("/users", getUsers);

// Create a new user
userRouter.post("/users", createUser);

export default userRouter;
