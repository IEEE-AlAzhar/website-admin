const CoreService = require("../core.service.js");
const Blog = require("../../models/Blog.model");
const SubscriberService = require("../subscribe/subscriber.service");

let subscriberService = new SubscriberService();

class BlogService extends CoreService {
  constructor() {
    super();
    this.initialize(Blog, "Blog");

    this.getById = this.getById.bind(this);
    this.search = this.search.bind(this);
    this.filter = this.filter.bind(this);
    this.createRecord = this.createRecord.bind(this);
    this.listRecords = this.listRecords.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
  }

  listRecords(req, res) {
    this.db
      .find({})
      .populate("categories")
      .then((records) => res.json(records))
      .catch(() =>
        res.status(500).json({
          msg: "An error occurred, please try again later!",
        })
      );
  }

  updateRecord(req, res) {
    const { id } = req.params;

    this.db
      .findByIdAndUpdate(id, { ...req.body }, { new: true })
      .populate("categories")
      .then((updatedRecord) => {
        res.json(updatedRecord);
      })
      .catch(() =>
        res.status(500).json({
          msg: "An error occurred, please try again later!",
        })
      );
  }

  getById(req, res) {
    let { id } = req.params;

    this.db
      .findById(id)
      .sort({ createdAt: "desc" })
      .populate("categories")
      .then((blog) => {
        if (!blog) return res.status(404).json({ msg: "Article not found !" });
        res.json(blog);
      })
      .catch(() => {
        res.json({ msg: "An error occurred !" });
      });
  }

  createRecord(req, res) {
    this.db
      .create({
        ...req.body,
      })
      .then((newRecord) => {
        res.json(newRecord);

        subscriberService.sendBlogEmail(newRecord, req.headers["origin"]);
      })
      .catch(() =>
        res.status(500).json({
          msg: "An error occurred, please try again later!",
        })
      );
  }

  search(req, res) {
    let query = req.query.q;
    let regexp = new RegExp(query, "i");
    this.db.find({ title: { $regex: regexp } }).then((response) => {
      if (!response)
        return res.status(404).json({ msg: "No articles founded" });

      res.json(response);
    });
  }

  filter(req, res) {
    let { categoryId } = req.params;

    this.db.find({ categories: { $in: categoryId } }).then((response) => {
      if (!response)
        return res.status(404).json({ msg: "No articles founded" });
      res.json(response);
    });
  }
}

module.exports = BlogService;
