var mongoDb = require("../model/mongodb");
var friendModel = require("../model/FriendModel");
exports.api = {};

exports.api.getFriends = async (req, res) => {
  let response = {};
  try {
    const { userId: userId } = req.user;
    console.log(userId);

    let friendIds = await friendModel.getFriendsId(userId);
    let friendList = await friendModel.getUsersListById(friendIds);

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
    let result = await friendModel.addFriend(userId, friendId);

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
    let result = await friendModel.deleteFriend(userId, friendId);
    response = responser();
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
    let friendList = await friendModel.getRecommendFriends(userId);

    response = responser();
    response.Data = friendList;
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
