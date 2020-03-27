import * as mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  user: String,
  redMarbles: Number,
  greenMarbles: Number
});

const poolSchema = new mongoose.Schema({
  code: String,
  date: String,
  totalPeople: Number,
  marbles: Number,
  results: [resultSchema]
});

const Pool = mongoose.model("Pool", poolSchema);
export default Pool;
