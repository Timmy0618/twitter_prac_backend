const { createClient } = require("redis");
const client = createClient({
  socket: { host: "redis" },
  password: "123456",
});
// exports.redis = {};

exports.set = async (key, value) => {
  await client.connect();
  return await client.set(key, value);
};

exports.get = async (key) => {
  await client.connect();
  return await client.get(key);
};
