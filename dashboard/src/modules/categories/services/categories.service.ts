import CrudService from "configurations/crud.service";

export default class CategoriesService extends CrudService {
  constructor() {
    super();
    this.initialize("/categories");
  }
}
