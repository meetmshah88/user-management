import { Error } from "../types/types";

export const throwError = (message: string, status: number): Error => {
    const error = new Error(message) as Error;
    error.status = status;
    throw error
}