const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  console.log("[authController] handleErrors", err.message, err.code);
  let errors = {};

  if (err.message === "Email Incorreto") {
    errors.email = "Email não cadastrado";
  }

  if (err.message === "Senha Incorreta") {
    errors.password = "Senha fornecida não confere";
  }

  if (err.code === 11000) {
    errors.email = "Email já cadastrado";
    return errors;
  }

  if (err.message.includes("Falha na validação")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports.signup_get = (req, res) => {
  console.log("[authController] signup_get");
  res.status(200).json({});
};

module.exports.login_get = async (req, res) => {
  console.log("[authController] login_get");
  const user = req.user;
  res.status(200).json({ user });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("[authController] signup_post", email, password);
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.status(201).json({ token });
  } catch (err) {
    const errors = handleErrors(err);
    console.log("[authController] signup_post errors", errors);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("[authController] login_post", email, password);
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ token });
    console.log("[authController] login_post token", token);
  } catch (err) {
    const errors = handleErrors(err);
    console.log("[authController] login_post errors", errors);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = async (req, res) => {
  // Lógica para logout, se necessário
};

const createToken = (id) => {
  return jwt.sign({ id }, "HLBDEV", {
    expiresIn: "7d",
  });
};
