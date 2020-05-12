import CrudService from "configurations/crud.service";

export default class EventService extends CrudService {
  constructor() {
    super();
    this.initialize("/events");
  }
}
