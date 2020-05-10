import CrudService from "configurations/crud.service";

export default class MessageService extends CrudService {
  constructor() {
    super();
    this.initialize("/messages");
  }
}
