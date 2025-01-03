import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import {
  isValidName,
  isValidEmail,
  validatedCreateUserData,
} from "../util/validation";
import { throwError } from "../util/error";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //Guard for received request body. Only expected fields should be part of request body.
    if (!validatedCreateUserData(req)) {
      throwError("Bad Request", 400);
    }

    const { firstName, lastName, emailId } = req.body;

    //Validations on the each fields of request body
    const isInvalidInput =
      !isValidName(firstName) ||
      !isValidName(lastName) ||
      !isValidEmail(emailId);

    if (isInvalidInput) {
      throwError("Bad Request", 400);
    }

    //verify if the emailId is already available in the database.
    const isUserExist = await User.findOne({ emailId });

    if (isUserExist) {
      throwError("User is already exist", 400);
    }

    const newUser = new User({ firstName, lastName, emailId });
    await newUser.save();
    res.status(201).json({ message: "User Added!" });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req.query);

    const { query } = req;
    const validParams = ["emailFilter", "searchText", "limit", "page"];
    if (!Object.keys(req.query).every((el) => validParams.includes(el))) {
      throwError("Invalid query params!", 400);
    }
    const { searchText = "", emailFilter = "", limit = 10, page = 1 } = query;

    const parsedLimit = parseInt(limit as string, 10);
    const pageNum = parseInt(page as string, 10);

    if (!(parsedLimit > 0 && pageNum > 0)) {
      throwError("Invalid query params!", 400);
    }

    const offset = parsedLimit * (pageNum - 1);

    const pipeline: any = [
      {
        $match: {
          $and: [
            {
              $or: [
                { firstName: { $regex: searchText, $options: "i" } },
                { lastName: { $regex: searchText, $options: "i" } },
              ],
            },
            emailFilter
              ? {
                  emailId: emailFilter,
                }
              : {},
          ],
        },
      },
      {
        $facet: {
          filteredUsers: [
            { $sort: { createdAt: -1 } },
            { $skip: offset },
            { $limit: parsedLimit },
          ],
          totalDocumentsCount: [{ $count: "count" }],
        },
      },
    ];

    const results = await User.aggregate(pipeline);

    const filteredUsers = results[0]?.filteredUsers || [];
    const totalDocumentsCount = results[0]?.totalDocumentsCount[0]?.count || 0;

    res.json({
      users: filteredUsers,
      page: pageNum,
      limit: parsedLimit,
      count: totalDocumentsCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserEmailIDs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const emails = await User.find().select("emailId");
    res.status(200).json(emails);
  } catch (error) {
    next(error);
  }
};

export const usersSeedings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const records = Array.from({ length: 100 }).map((_, index) => {
      return {
        firstName: `First User ${index}`,
        lastName: `Last User ${index}`,
        emailId: `user${index}@example.com`,
      };
    });
    await User.insertMany(records);
    res.status(200).send("Sample Users are added");
  } catch (error) {
    next(error);
  }
};

export const usersUnseeded = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await User.deleteMany({ emailId: { $regex: "@example.com" } });
    res.status(204).send("Users deleted");
  } catch (error) {
    next(error);
  }
};
