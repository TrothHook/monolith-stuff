const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../config/index");

exports.hashPassword = async (password) => {
  try {
    password = await bcrypt.hash(password, 12);
    return password;
  } catch (error) {
    console.log(error);
  }
};

exports.validatePassword = async (enteredPassword, savedPassword) => {
  try {
    return await bcrypt.compare(enteredPassword, savedPassword);
  } catch (error) {
    console.log(error);
  }
};

exports.generateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.validateSignature = async (req) => {
  try {
    const signature = req.header.authorization;
    const token = signature.split(" ")[1];
    const payload = await jwt.verify(token, APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.formatData = (data) => {
  if (data) {
    return data;
  } else {
    throw new Error("Data not found");
  }
};
