const CoreService = require("../core.service.js");
const Category = require("../../models/Category.model");
const Blog = require("../../models/Blog.model");

class CategoryService extends CoreService {
  constructor() {
    super();
    this.initialize(Category, "Category");
  }

  deleteRecord(req, res) {
    const { id } = req.params;

    this.db.findById(id).then((category) => {
      // If there's any article has this category --> send error
      Blog.find({ categories: { $in: category.id } }).then((users) => {
        if (users && users.length > 0) {
          res.status(400).json({
            msg:
              "There's articles on this category, please remove articles first then retry !",
          });
        } else {
          this.db
            .findByIdAndRemove(id)
            .then(() => {
              res.json({
                msg: `${this.name} has been deleted successfully!`,
              });
            })
            .catch(() =>
              res.status(500).json({
                msg: "An error occurred, please try again later!",
              })
            );
        }
      });
    });
  }
}

module.exports = CategoryService;
