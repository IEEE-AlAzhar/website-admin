const CoreService = require("../core.service.js");
const BestMember = require("../../models/Best-member.model");

class BestMemberService extends CoreService {
  constructor() {
    super();
    this.initialize(BestMember, "Member");
  }
}

module.exports = BestMemberService;
