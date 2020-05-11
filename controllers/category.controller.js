const express = require("express");
const server = express.Router();
const verifyToken = require("../helpers/verifyToken");

const CategoryService = require("../services/category/category.service");
let categoryService = new CategoryService();

server.get("/list", verifyToken(), categoryService.listRecords);
server.post("/new", verifyToken(), categoryService.createRecord);
server.put("/:id", verifyToken(), categoryService.updateRecord);
server.delete("/:id", verifyToken(), categoryService.deleteRecord);

module.exports = server;
