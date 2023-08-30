const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  create,
  login,
  index,
  getByUsername,
  detail,
};

async function create(req, res) {
  try {
    const user = await User.create(req.body);
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) throw new Error();
    // Check if the password matches
    // const match = await bcrypt.compare(req.body.password, user.password);
    // if (!match) throw new Error();
    // res.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000');
    res.json(createJWT(user));
  } catch {
    res.status(400).json("Incorrect Username");
  }
}

async function index(req, res) {
  try {
  } catch (err) {
    res.status(400).json(err);
  }
}

async function detail(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function getByUsername(req, res) {
  try {
  } catch (err) {
    res.status(400).json(err);
  }
}

//==============================================

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: "24h" }
  );
}
