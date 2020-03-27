import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nickname: { type: String, unique: true },
  role: String
});

const User = mongoose.model("User", userSchema);

export default User;
