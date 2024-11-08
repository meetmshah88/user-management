import express from "express";
import dotenv from "dotenv";
import cors from "cors";
//import connectDB from './db';
//import userRoutes from './routes/userRoutes';

dotenv.config();
//connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({ data: { name: "Meet Shah1" } });
});

const PORT = process.env.PORT || 5000;
export const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`),
);
