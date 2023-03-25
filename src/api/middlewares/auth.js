const { validateSignature } = require("../../utils/index");

module.exports = async (req, res, next) => {
  const isAuthorized = await validateSignature(req);

  if (isAuthorized) {
    return next();
  }

  return res.status(403).json({
    status: "Fail",
    msg: "Not Authorized",
  });
};
