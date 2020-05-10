import CrudService from "configurations/crud.service";
import { Email } from "configurations/interfaces/email.interface";

export default class SubscriberService extends CrudService {
  constructor() {
    super();
    this.initialize("/subscribers");
  }

  async sendEmail(email: Email) {
    let { data } = await this._http.post(`${this.url}/email`, email);
    return data;
  }
}
