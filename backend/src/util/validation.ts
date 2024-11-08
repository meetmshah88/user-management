import { Request } from "express";

export const isValidName = (name: string): boolean => {
    return /^[A-Za-z]+$/.test(name);
}

export const isValidEmail = (email: string): boolean => {
    return /^\S+@\S+\.\S+$/.test(email);
}

export const validatedCreateUserData = (req: Request): boolean => {
    const userCreateFields = [
        "firstName",
        "lastName",
        "emailId"
    ];

    const isCreateUserFieldValid = Object.keys(req.body).every((field) =>
        userCreateFields.includes(field)
    );

    return isCreateUserFieldValid;
};