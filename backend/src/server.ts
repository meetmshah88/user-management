import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./database/db";
import userRoutes from "./routes/userRouter";
import { errorHandler } from "./handlers/errorHandler";
import { allRoutesHandler } from "./handlers/allRoutesHandler";
import { trimRequestBody } from "./handlers/trimRequestBodyHandler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//This middleware is used to removes whitespace from both sides of a string in request body
app.use(trimRequestBody);

//Handle All Users Management Routes
app.use("/api", userRoutes);

// Catch-all 404 handler (must be last among route handlers)
app.use(allRoutesHandler);

//Handle All Errors across express application
app.use(errorHandler);

let server;
connectDB()
  .then(() => {
    console.log("Database connection established...");
    const PORT = process.env.PORT || 5000;

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.error("Database cannot be connected!!");
  });

export default server;