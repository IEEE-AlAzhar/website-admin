const CoreService = require("../core.service.js");
const Message = require("../../models/Message.model");

class MessageService extends CoreService {
  constructor() {
    super();
    this.initialize(Message, "Message");
  }
}

module.exports = MessageService;
