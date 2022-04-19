const multer = require("multer");
var express = require("express");
var jwt = require("express-jwt");
var jwtConfig = require("../config/jwt");
var auth = require("../controller/AuthController");
require("../config/database");

var router = express.Router();
const PinataController = require("../controller/PinataController");
const FileController = require("../controller/FileController");
const MainController = require("../controller/MainController");

// 初始化設定
const upload = multer({
  // storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 限制 2 MB
  },
  fileFilter(req, file, callback) {
    // 限制檔案格式為 image
    if (!file.mimetype.match(/^image/)) {
      callback((new Error().message = "檔案格式錯誤"));
    } else {
      callback(null, true);
    }
  },
});

router.post(
  "/api/v1/uploadFile",
  upload.single("image"),
  async (req, res, next) => {
    FileController.api.uploadFile(req, res);
  }
);

router.get("/api/v1/mongo/getImage", async (req, res, next) => {
  FileController.api.getImage(req, res);
});

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
  MainController.api.getFriends(req, res);
});

module.exports = router;
