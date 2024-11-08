import { Request, Response, NextFunction } from 'express';

export const trimRequestBody = (req: Request, res: Response, next: NextFunction): void => {
    if (req.body && typeof req.body === 'object') {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        }
    }
    next();
}
