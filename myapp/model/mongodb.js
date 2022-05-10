var mongoDb = require("../lib/mongodb");

exports.updateOne = async function (
  collectionTable,
  whereObject,
  updateObject
) {
  let collection = mongoDb.collection(collectionTable);
  const updateResult = collection.updateOne(whereObject, updateObject);
  return updateResult;
};

exports.insertMany = async function (collectionTable, insertArray) {
  let collection = mongoDb.collection(collectionTable);
  const insertResult = await collection.insertMany(insertArray);
  return insertResult;
};

exports.find = async function (collectionTable, findObject, fieldsObject = {}) {
  let collection = mongoDb.collection(collectionTable);
  const findResult = await collection
    .find(findObject)
    .project(fieldsObject)
    .toArray();
  return findResult;
};

exports.findSort = async function (
  collectionTable,
  findObject,
  sortObject,
  limit
) {
  let collection = mongoDb.collection(collectionTable);
  const findResult = await collection
    .find(findObject)
    .sort(sortObject)
    .limit(limit)
    .toArray();
  return findResult;
};

exports.update = async function (collectionTable, findObject, setObject) {
  let collection = mongoDb.collection(collectionTable);
  const findResult = await collection.updateOne(findObject, setObject);
  return findResult;
};

exports.aggregate = async function (collectionTable, aggregateAry) {
  let collection = mongoDb.collection(collectionTable);
  const findResult = await collection.aggregate(aggregateAry).toArray();
  return findResult;
};
