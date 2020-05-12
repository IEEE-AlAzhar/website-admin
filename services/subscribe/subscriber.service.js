const CoreService = require("../core.service.js");
const Subscriber = require("../../models/Subscriber.model");
const sgMail = require("@sendgrid/mail");

class SubscriberService extends CoreService {
  constructor() {
    super();
    this.initialize(Subscriber, "Subscriber");

    this.sendCustomEmail = this.sendCustomEmail.bind(this);
    this.sendBlogEmail = this.sendBlogEmail.bind(this);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  titleSlugify(title) {
    return title.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "-and-");
  }

  sendBlogEmail(blog, origin) {
    let blogLink = `${origin}/blog/${blog._id}/${this.titleSlugify(
      blog.title
    )}`;
    this.db
      .find({})
      .then((subscribers) => {
        subscribers.forEach(({ email }) => {
          const msg = {
            to: email,
            from: "ieee.az.sb@gmail.com",
            subject: "New article published, Check it now!",
            html: `
              <div style="text-align: center;">
                <img src="${blog.cover}" />
                <h1> ${blog.title} </h1>
                <p> ${blog.metaDescription} </p>
                <a href="${blogLink}"> Read it now !</a>
              </div>
            `,
          };
          return sgMail.send(msg);
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

  sendCustomEmail(req, res) {
    let { subject, body } = req.body;

    this.db
      .find({})
      .then((subscribers) => {
        subscribers.forEach(({ email }) => {
          const msg = {
            to: email,
            from: "ieee.az.sb@gmail.com",
            subject,
            html: `
              <h1> ${subject} </h1>
              <p> ${body} </p>
            `,
          };
          return sgMail.send(msg);
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