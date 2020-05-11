const express = require("express");
const server = express.Router();
const verifyToken = require("../helpers/verifyToken");

const BlogService = require("../services/blog/blog.service");
let blogService = new BlogService();

server.get("/list", blogService.listRecords);
server.get("/search", blogService.search);
server.get("/filter/:categoryId", blogService.filter);
server.post("/new", verifyToken(), blogService.createRecord);
server.put("/:id", verifyToken(), blogService.updateRecord);
server.delete("/:id", verifyToken(), blogService.deleteRecord);

server.get("/:id", blogService.getById);

module.exports = server;
