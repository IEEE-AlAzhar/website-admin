import CrudService from "configurations/crud.service";

export default class BlogService extends CrudService {
  constructor() {
    super();
    this.initialize("/blog");
  }
}
