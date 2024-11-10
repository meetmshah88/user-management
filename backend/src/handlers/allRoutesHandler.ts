import { Request, Response } from "express";

export const allRoutesHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ message: "Route not found" });
};
