import { ErrorType } from "../types/types";

export const throwError = (message: string, status: number): ErrorType => {
    const error = new Error(message) as ErrorType;
    error.status = status;
    throw error
}