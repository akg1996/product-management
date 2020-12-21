const User = require("../models/User")
const jwt = require("jsonwebtoken")
let tokenLasts = "7d"

exports.login = function (req, res) {
  let user = new User(req.body)
  user
    .login()
    .then(() => {
      res.json({
        token: jwt.sign({ _id: user.data._id, username: user.data.username }, process.env.JWTSECRET, { expiresIn: tokenLasts }),
        username: user.data.username
      })
    })
    .catch(function (e) {
      res.json(false)
    })
}

exports.register = function (req, res) {
  let user = new User(req.body)
  user
    .register()
    .then(() => {
      res.json({
        token: jwt.sign({ _id: user.data._id, username: user.data.username }, process.env.JWTSECRET, { expiresIn: tokenLasts }),
        username: user.data.username
      })
    })
    .catch(regErrors => {
      res.status(500).send(regErrors)
    })
}
