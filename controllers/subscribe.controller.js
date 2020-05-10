const express = require("express");
const server = express.Router();
const verifyToken = require("../helpers/verifyToken");

const SubscriberService = require("../services/subscribe/subscriber.service");

let subscriberService = new SubscriberService();

server.post("/new", subscriberService.createRecord);
server.get("/list", verifyToken(), subscriberService.listRecords);
server.delete("/:id", verifyToken(), subscriberService.deleteRecord);
server.post("/email", verifyToken(), subscriberService.sendCustomEmail);

module.exports = server;
