const usersCollection = require("../db").db().collection("users")
const validator = require("validator")
const bcrypt = require("bcryptjs")

let User = function (data) {
  this.data = data
  this.errors = []
}

User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = ""
  }
  if (typeof this.data.fullname != "string") {
    this.data.fullname = ""
  }
  if (typeof this.data.email != "string") {
    this.data.email = ""
  }
  if (typeof this.data.phone != "string") {
    this.data.phone = ""
  }
  if (typeof this.data.password != "string") {
    this.data.password = ""
  }

  this.data = {
    username: this.data.username.trim().toLowerCase(),
    fullname: this.data.fullname.trim(),
    email: this.data.email.trim().toLowerCase(),
    phone: this.data.phone,
    password: this.data.password
  }
}

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.username == "") {
      this.errors.push("You must provide a username.")
    }
    if (this.data.fullname == "") {
      this.errors.push("You must provide a name.")
    }
    if (this.data.phone == "") {
      this.errors.push("You must provide a phone number.")
    }
    if (this.data.phone.length > 0 && this.data.phone.length < 10) {
      this.errors.push("Phone Number must be atleast 10 digits")
    }
    if (this.data.phone.length > 14) {
      this.errors.push("Phone Number maximum 13 characters")
    }
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
      this.errors.push("Username can only contain letters and numbers.")
    }
    if (!validator.isEmail(this.data.email)) {
      this.errors.push("You must provide a valid email address.")
    }
    if (this.data.password == "") {
      this.errors.push("You must provide a password.")
    }
    if (this.data.password.length > 0 && this.data.password.length < 5) {
      this.errors.push("Password must be at least 5 characters.")
    }
    if (this.data.password.length > 50) {
      this.errors.push("Password cannot exceed 50 characters.")
    }
    if (this.data.username.length > 0 && this.data.username.length < 3) {
      this.errors.push("Username must be at least 3 characters.")
    }
    if (this.data.username.length > 10) {
      this.errors.push("Username cannot exceed 10 characters.")
    }

    // Only if username is valid then check to see if it's already taken
    if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
      let usernameExist = await usersCollection.findOne({ username: this.data.username })
      if (usernameExist) {
        this.errors.push("That username is already taken.")
      }
    }

    // Only if email is valid then check to see if it's already taken
    if (validator.isEmail(this.data.email)) {
      let emailExists = await usersCollection.findOne({ email: this.data.email })
      if (emailExists) {
        this.errors.push("That email is already being used.")
      }
    }
    resolve()
  })
}

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    usersCollection
      .findOne({ username: this.data.username })
      .then(attemptedUser => {
        if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
          this.data = attemptedUser
          resolve("Congrats!")
        } else {
          reject("Invalid username / password.")
        }
      })
      .catch(function (e) {
        reject(e)
      })
  })
}

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    // Validate user data
    this.cleanUp()
    await this.validate()

    // Only if there are no validation errors
    // then save the user data into a database
    if (!this.errors.length) {
      // hash user password
      let salt = bcrypt.genSaltSync(10)
      this.data.password = bcrypt.hashSync(this.data.password, salt)
      await usersCollection.insertOne(this.data)
      resolve()
    } else {
      reject(this.errors)
    }
  })
}

module.exports = User
