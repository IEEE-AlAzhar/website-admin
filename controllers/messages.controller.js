const express = require("express");
const server = express.Router();
const verifyToken = require("../helpers/verifyToken");

const MessageService = require("../services/message/message.service");

let messageService = new MessageService();

server.post("/new", messageService.createRecord);
server.get("/list", verifyToken(), messageService.listRecords);
server.delete("/:id", verifyToken(), messageService.deleteRecord);

module.exports = server;
