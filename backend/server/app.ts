// import * as dotenv from 'dotenv';
import * as express from "express";
import * as morgan from "morgan";
import * as mongoose from "mongoose";
import * as cfenv from "cfenv";
import * as cors from "cors";
import * as fs from "fs";

import setRoutes from "./routes";

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect("mongodb://169.48.255.194:32513/marblesdb")
  .then((_db: any) => {
    console.log(`Connected to MongoDB!`);
  })
  .catch(err => console.error(err));

// import * as db from "./config/db";
// db.initDBConnection();

var appEnv = cfenv.getAppEnv();
// appEnv.port, "0.0.0.0", == 3000
var port = 3000;
app.listen(port, function () {
  console.log(`Running at ${port}`);
});

setRoutes(app);

export { app };
