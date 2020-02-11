import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import lusca from "lusca";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";
import cors from "cors";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

import * as commentsController from "./controllers/comment";

const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        console.log("MongoDB connected!");
    },
).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
});

app.set("port", process.env.PORT || 3002);
const corsConfig = {
    origin: true,
    credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// app.use(function (req, res, next) {
//     if (req.path.indexOf(".") === -1) {
//         res.setHeader("Content-Type", "text/html");
//     }
//     next();
// });
// app.use("./../public", 
//     express.static(path.join(__dirname, "build"))
// );
// app.get("*", function (req, res) {
//     res.sendFile(path.join(__dirname, "../public/build", "index.html"));
//  });


app.post("/create", commentsController.postCreate);
app.post("/update", commentsController.postUpdate);
app.get("/read", commentsController.getRead);
app.get("/delete", commentsController.getDelete);
app.get("/comments", commentsController.getComments);


export default app;
