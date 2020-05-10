const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

require("dotenv").config();

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

//Middlewares
app.use(express.json());
app.use(cors());

const announcementController = require("./controllers/announcements.controller.js");
app.use("/api/announcements", announcementController);

const bestMemberController = require("./controllers/best-members.controller");
app.use("/api/best-members", bestMemberController);

const committeeController = require("./controllers/committees.controller");
app.use("/api/committees", committeeController);

const subscriberController = require("./controllers/subscribe.controller");
app.use("/api/subscribers", subscriberController);

const messageController = require("./controllers/messages.controller");
app.use("/api/messages", messageController);

const userController = require("./controllers/users.controller");
app.use("/api/users", userController);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));

  // always send the index.html file to handle SPA routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });
}

// disable the X-Powered-By header instead of using helmet
app.disable("x-powered-by");

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to port ${port}`));
