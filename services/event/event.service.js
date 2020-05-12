const CoreService = require("../core.service.js");
const Event = require("../../models/Event.model");
const SubscriberService = require("../subscribe/subscriber.service");

let subscriberService = new SubscriberService();

class EventService extends CoreService {
  constructor() {
    super();
    this.initialize(Event, "Event");
  }

  createRecord(req, res) {
    this.db
      .create({
        ...req.body,
      })
      .then((newRecord) => {
        res.json(newRecord);

        subscriberService.sendEventEmail(newRecord);
      })
      .catch(() =>
        res.status(500).json({
          msg: "An error occurred, please try again later!",
        })
      );
  }
}

module.exports = EventService;
