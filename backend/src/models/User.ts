import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 100 },
  lastName: { type: String, required: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    unique: true
  },
});

export default mongoose.model("User", userSchema);
