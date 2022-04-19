var express = require("express");
var router = express.Router();
const UserController = require("../controller/UserController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/add", function (req, res, next) {
  UserController.api.addUser(req, res);
});

router.post("/login", function (req, res, next) {
  UserController.api.login(req, res);
});

router.post("/edit", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
