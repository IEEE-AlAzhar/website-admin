const CoreService = require("../core.service.js");
const Subscriber = require("../../models/Subscriber.model");
const sgMail = require("@sendgrid/mail");

class SubscriberService extends CoreService {
  constructor() {
    super();
    this.initialize(Subscriber, "Subscriber");

    this.sendCustomEmail = this.sendCustomEmail.bind(this);
  }

  sendCustomEmail(req, res) {
    let { subject, body } = req.body;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    Subscriber.find({})
      .then((subscribers) => {
        subscribers.forEach(({ email }) => {
          const msg = {
            to: email,
            from: "ieee.az.sb@gmail.com",
            subject,
            text: body,
          };
          return sgMail.send(msg)
        });
      })
      .then(() => {
        res.json({ msg: "Emails sent successfully !" });
      })
      .catch(() => {
        res
          .status(500)
          .json({ msg: "An Error occurred, please try again later" });
      });
  }
}

module.exports = SubscriberService;
