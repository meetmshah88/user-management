import { NextFunction, Request, Response } from "express";
import { Error } from "../types/types";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const code = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(code).json({ message });
}