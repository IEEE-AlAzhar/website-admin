const express = require("express");
const server = express.Router();
const verifyToken = require("../helpers/verifyToken");

const UserService = require("../services/user/user.service");

let userService = new UserService();

server.post("/login", userService.login);
server.get("/logout", verifyToken(), userService.logout);
server.put("/:id", verifyToken(), userService.updateRecord);
server.get("/list", verifyToken(), userService.listRecords);
server.post("/new", verifyToken(), userService.createRecord);
server.delete("/:id", verifyToken(), userService.deleteRecord);

// server.get("/me/:id", verifyToken(), userService.getUserById);

module.exports = server;
