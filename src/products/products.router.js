const router = require("express").Router();
const controller = require("./products.controller");

router.route("/").get(controller.list).post(controller.create);
router.route("/:ingredient_name").get(controller.read);

module.exports = router;
