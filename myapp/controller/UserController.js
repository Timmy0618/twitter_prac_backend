const mongoDb = require("../model/mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const saltRounds = 10;
const collection = "users";

exports.api = {};

exports.api.addUser = async (req, res) => {
  let response = {};

  try {
    const { userName, password } = req.body;
    await mongoDb.insertMany(collection, [
      {
        user_id: userName,
        password: await bcrypt.hash(password, saltRounds),
      },
    ]);
    response = responser();
  } catch (err) {
    response = responser(err.code);
  }

  res.json(response);
};

exports.api.login = async (req, res) => {
  let response = {};
  try {
    const { userName, password: plaintextPassword } = req.body;

    let result = await mongoDb.find(collection, {
      user_id: userName,
    });

    const match = bcrypt.compareSync(plaintextPassword, result[0].password);

    if (match) {
      response = responser();
      let token = jwt.sign(
        { userName: userName, userId: result[0]._id },
        jwtConfig.secret
      );
      response = responser();
      response.Data = { token: token };
    } else {
      response = responser(401);
    }
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
    case 11000:
      response.Code = "500";
      response.Msg = "Duplicate";
      break;

    default:
      response.Code = "500";
      response.Msg = "DB Error";
      break;
  }

  return response;
}
