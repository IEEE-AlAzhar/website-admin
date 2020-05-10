const CoreService = require("../core.service.js");
const User = require("../../models/User.model");
const jwt = require("jsonwebtoken");
const config = require("../../config/token");

class UserService extends CoreService {
  constructor() {
    super();
    this.initialize(User, "User");
    this.login = this.login.bind(this);
    // this.listRecords = this.listRecords.bind(this);
  }

  // getUserById(req, res) {
  //   const { id } = req.params;
  //   this.db
  //     .findById(id)
  //     .populate("achievements")
  //     .populate("feedbacks")
  //     .then((newUser) => {
  //       res.json(newUser);
  //     })
  //     .catch(() => {
  //       res.status(404).json({ msg: `${this.name} not found` });
  //     });
  // }

  login(req, res) {
    const { username, password } = req.body;
    this.db
      .findOne({ username, password })
      .then((user) => {
        if (user) {
          const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 2592000, // 1 month
          });

          res.json({ auth: true, token: token, user });
        } else {
          res.status(404).json({ msg: `${this.name} does not exist!` });
        }
      })
      .catch((err) =>
        res.status(500).json({
          msg: "An error occurred, please try again later!",
          error: err,
        })
      );
  }

  logout(req, res) {
    req.user = null;
    res.json({ success: true });
  }

  // listRecords(req, res) {
  //   let { type, committee } = req.user;
  //   if (type === "Admin") {
  //     this.db
  //       .find({})
  //       .then((records) => res.json(records))
  //       .catch(() =>
  //         res.status(500).json({
  //           msg: "An error occurred, please try again later!",
  //         })
  //       );
  //   } else {
  //     this.db
  //       .find({ committee })
  //       .then((records) => res.json(records))
  //       .catch(() =>
  //         res.status(500).json({
  //           msg: "An error occurred, please try again later!",
  //         })
  //       );
  //   }
  // }
}

module.exports = UserService;
