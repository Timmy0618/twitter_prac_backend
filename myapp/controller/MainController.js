const { ObjectId } = require("mongodb");
var mongoDb = require("../model/mongodb");
const { v4: uuidv4 } = require("uuid");
exports.api = {};

exports.api.post = async (req, res) => {
  let response = {};
  try {
    const { userName: userName, userId: userId } = req.user;
    const { post } = req.body;
    var uuid = null;
    if (req.file && req.file.buffer) {
      var uuid = uuidv4();
      mongoDb.insertMany("img", [{ _id: uuid, img: req.file.buffer }]);
    }
    let insertObj = {
      user_id: userId,
      post: post,
      img: uuid,
      create_time: new Date(),
    };
    mongoDb.insertMany("posts", [insertObj]);
    response = responser();
  } catch (err) {
    console.log(err);
    response = responser(err.code);
  }

  res.json(response);
};

exports.api.getImage = async (req, res) => {
  let response = {};
  try {
    let result = await mongoDb.find("img", { _id: req.params.id });
    // res.set("Content-Type", "application/binary");
    res.set("Content-Type", "image/png");
    console.log(typeof result[0].img.buffer, Object.keys(result[0].img));

    res.send(result[0].img.buffer);
  } catch (err) {
    console.log(err);
    response = responser(err.code);
  }
};

exports.api.getPost = async (req, res) => {
  let response = {};
  try {
    const { userName: userId } = req.user;
    let posts = await mongoDb.find("posts", { user_id: userId });
    response = responser();
    response.Data = posts;
  } catch (err) {
    console.log(err);
    response = responser(err.code);
  }

  res.json(response);
};

exports.api.getAllPost = async (req, res) => {
  let response = {};
  try {
    var posts = await mongoDb.findSort("posts", {}, { create_time: 1 }, 3);
    for (let index = 0; index < posts.length; index++) {
      let post = posts[index];
      // console.log(post.user_id);
      let user = await mongoDb.find("users", { _id: ObjectId(post.user_id) });
      posts[index].user_avatar = user[0].avatar;

      // console.log(user);
    }
    response = responser();
    response.Data = posts;
  } catch (err) {
    console.log(err);
    response = responser(err.code);
  }

  res.json(response);
};

exports.api.getProfile = async (req, res) => {
  let response = {};
  try {
    const { userName: userId } = req.user;
    let user = await mongoDb.find("users", { user_id: userId });
    response = responser();
    response.Data = user[0];
  } catch (err) {
    console.log(err);
    response = responser(err.code);
  }

  res.json(response);
};

exports.api.uploadAvatar = async (req, res) => {
  let response = {};
  try {
    const { userName: userId } = req.user;
    const img = req.file.buffer;

    if (req.file && req.file.buffer) {
      var uuid = uuidv4();
      mongoDb.insertMany("img", [{ _id: uuid, img: req.file.buffer }]);
    }

    let user = await mongoDb.update(
      "users",
      { user_id: userId },
      { $set: { avatar: uuid } }
    );

    response = responser();
  } catch (err) {
    console.log(err);
    response = responser(err.code);
  }

  res.json(response);
};

exports.api.getFriends = async (req, res) => {
  let response = {};
  try {
    const { userId: userId } = req.user;

    let userFriendList = await mongoDb.aggregate("users", [
      { $match: { _id: ObjectId(userId) } },
      { $project: { friendList: 1, _id: 0 } },
    ]);

    let userFriendId = userFriendList[0].friendList.map(function (i) {
      return ObjectId(i);
    });

    let friendList = await mongoDb.aggregate("users", [
      {
        $match: {
          $and: [{ _id: { $in: userFriendId } }],
        },
      },
      { $project: { user_id: 1, avatar: 1, _id: 1 } },
    ]);

    response = responser();
    response.Data = friendList;
  } catch (err) {
    console.log(err);
    response = responser(err.code);
  }
  res.json(response);
};

exports.api.recommendFriends = async (req, res) => {
  let response = {};
  try {
    const { userId: userId } = req.user;

    let userFriendList = await mongoDb.aggregate("users", [
      { $match: { _id: ObjectId(userId) } },
      { $project: { friendList: 1, _id: 0 } },
    ]);

    let userFriendId = userFriendList[0].friendList.map(function (i) {
      return ObjectId(i);
    });

    let friendList = await mongoDb.aggregate("users", [
      {
        $match: {
          $and: [
            { user_id: { $ne: ObjectId(userId) } },
            { _id: { $nin: userFriendId } },
          ],
        },
      },
      { $project: { user_id: 1, avatar: 1, _id: 1 } },
      { $sample: { size: 3 } },
    ]);

    response = responser();
    response.Data = friendList;
  } catch (err) {
    console.log(err);
    response = responser(err.code);
  }
  res.json(response);
};

exports.api.addFriends = async (req, res) => {
  let response = {};
  try {
    const { userId: userId } = req.user;
    const { friendId } = req.body;

    let result = await mongoDb.update(
      "users",
      { _id: ObjectId(userId) },
      { $push: { friendList: friendId } }
    );

    response = responser();
  } catch (err) {
    console.log(err);
    response = responser(err.code);
  }
  res.json(response);
};

exports.api.deleteFriends = async (req, res) => {
  let response = {};
  try {
    const { userId: userId } = req.user;
    const friendId = req.params.userId;

    let userFriendList = await mongoDb.aggregate("users", [
      { $match: { _id: ObjectId(userId) } },
      { $project: { friendList: 1, _id: 0 } },
    ]);

    let friendList = userFriendList[0].friendList.filter(
      (value, index, array) => {
        return value != friendId;
      }
    );

    let result = await mongoDb.update(
      "users",
      { _id: ObjectId(userId) },
      { $set: { friendList: friendList } }
    );

    response = responser();
  } catch (err) {
    console.log(err);
    response = responser(err.code);
  }
  res.json(response);
};

function responser(errCode = 200) {
  const response = {
    Code: "200",
    Msg: "Success",
  };
  switch (errCode) {
    case 200:
      response.Msg = "Success";
      break;

    case 401:
      response.Code = "401";
      response.Msg = "Password Error";
      break;

    default:
      response.Code = "500";
      response.Msg = "Server Error";
      break;
  }

  return response;
}
