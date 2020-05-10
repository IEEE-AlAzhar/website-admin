const express = require("express");
const server = express.Router();
const verifyToken = require("../helpers/verifyToken");

const BestMemberService = require("../services/best-member/best-member.service");

let bestMemberService = new BestMemberService();

server.get("/list", bestMemberService.listRecords);
server.put("/:id", verifyToken(), bestMemberService.updateRecord);
server.post("/new", verifyToken(), bestMemberService.createRecord);
server.delete("/:id", verifyToken(), bestMemberService.deleteRecord);

module.exports = server;
