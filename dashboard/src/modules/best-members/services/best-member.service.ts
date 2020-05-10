import CrudService from "configurations/crud.service";

export default class BestMembersService extends CrudService {
  constructor() {
    super();
    this.initialize("/best-members");
  }
}
