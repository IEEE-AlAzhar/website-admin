const express = require("express");
const server = express.Router();
const verifyToken = require("../helpers/verifyToken");

const EventService = require("../services/event/event.service");
let eventService = new EventService();

server.get("/list", eventService.listRecords);
server.post("/new", verifyToken(), eventService.createRecord);
server.put("/:id", verifyToken(), eventService.updateRecord);
server.delete("/:id", verifyToken(), eventService.deleteRecord);

server.get("/:id", eventService.getById);

module.exports = server;
