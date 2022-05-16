const mongoDb = require("../lib/mongodb");
const { ObjectId } = require("mongodb");

exports.getFriendsId = async (userId) => {
  let collection = mongoDb.collection("users");

  const userFriendList = await collection
    .aggregate([
      { $match: { _id: ObjectId(userId) } },
      { $project: { friendList: 1, _id: 0 } },
    ])
    .toArray();

  let userFriendId = userFriendList[0].friendList.map(function (i) {
    return ObjectId(i);
  });

  return userFriendId;
};

exports.getUsersListById = async (userId) => {
  let collection = mongoDb.collection("users");

  const usersList = await collection
    .aggregate([
      {
        $match: {
          $and: [{ _id: { $in: userId } }],
        },
      },
      { $project: { user_id: 1, avatar: 1, _id: 1 } },
    ])
    .toArray();

  return usersList;
};

exports.addFriend = async (userId, friendId) => {
  let collection = mongoDb.collection("users");

  const result = await collection.updateOne(
    { _id: ObjectId(userId) },
    { $push: { friendList: friendId } }
  );

  return result;
};

exports.deleteFriend = async (userId, friendId) => {
  let collection = mongoDb.collection("users");

  const userFriendList = await collection
    .aggregate([
      { $match: { _id: ObjectId(userId) } },
      { $project: { friendList: 1, _id: 0 } },
    ])
    .toArray();

  const friendList = userFriendList[0].friendList.filter(
    (value, index, array) => {
      return value != friendId;
    }
  );

  let result = await collection.updateOne(
    { _id: ObjectId(userId) },
    { $set: { friendList: friendList } }
  );

  return result;
};

exports.getRecommendFriends = async (userId) => {
  let collection = mongoDb.collection("users");
  let userFriendId = await this.getFriendsId(userId);

  let friendList = await collection
    .aggregate([
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
    ])
    .toArray();

  return friendList;
};
