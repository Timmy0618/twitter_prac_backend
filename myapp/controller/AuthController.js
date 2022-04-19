module.exports = function (req, res) {
  if (!req.user.userName || !req.user.userId) return res.sendStatus(401);
};
