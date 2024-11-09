export interface ErrorType extends Error {
  status?: number;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
}