var express = require("express");
var jwt = require("express-jwt");
var jwtConfig = require("../config/jwt");
var upload = require("../config/multer");
var auth = require("../controller/AuthController");
const MainController = require("../controller/MainController");

var router = express.Router();

//-----------
//----文章----
//-----------

router.get("/api/v1/post", jwt(jwtConfig), function (req, res) {
  auth(req, res);
  MainController.api.getPost(req, res);
});

router.get("/api/v1/all-post", jwt(jwtConfig), function (req, res) {
  auth(req, res);
  MainController.api.getAllPost(req, res);
});

router.post(
  "/api/v1/post",
  upload.single("image"),
  jwt(jwtConfig),
  function (req, res) {
    auth(req, res);
    MainController.api.post(req, res);
  }
);

//-----------
//----個人資料----
//-----------

router.get("/api/v1/profile", jwt(jwtConfig), function (req, res) {
  auth(req, res);
  MainController.api.getProfile(req, res);
});

//-----------
//----照片----
//-----------

router.get("/api/v1/image/:id", function (req, res) {
  MainController.api.getImage(req, res);
});

router.post(
  "/api/v1/avatar",
  upload.single("image"),
  jwt(jwtConfig),
  function (req, res, next) {
    auth(req, res);
    MainController.api.uploadAvatar(req, res);
  }
);

//-----------
//----好友----
//-----------

router.get("/api/v1/friends", jwt(jwtConfig), function (req, res) {
  auth(req, res);
  MainController.api.getFriends(req, res);
});

router.post("/api/v1/friend", jwt(jwtConfig), function (req, res) {
  auth(req, res);
  MainController.api.addFriends(req, res);
});

router.delete("/api/v1/friend/:userId", jwt(jwtConfig), function (req, res) {
  auth(req, res);
  MainController.api.deleteFriends(req, res);
});

router.get("/api/v1/recommendFriends", jwt(jwtConfig), function (req, res) {
  auth(req, res);
  MainController.api.recommendFriends(req, res);
});

module.exports = router;
