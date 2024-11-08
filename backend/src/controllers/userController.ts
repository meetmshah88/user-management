
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { isValidName, isValidEmail, validatedCreateUserData } from "../util/validation";
import { throwError } from "../util/error";

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    if (!validatedCreateUserData(req)) {
        throwError("Bad Request", 400);
    }

    const { firstName, lastName, emailId } = req.body;

    const isInvalidInput = !isValidName(firstName) || !isValidName(lastName) || !isValidEmail(emailId);

    if (isInvalidInput) {
        throwError("Bad Request", 400);
    }

    try {
        const newUser = new User({ firstName, lastName, emailId });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        next(error);
    }
}