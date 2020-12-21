const dotenv = require("dotenv")
dotenv.config()
const mongodb = require("mongodb")

mongodb.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  if (err) {
    console.log(err)
  }
  module.exports = client
  console.log("database connected successfully")
  const app = require("./index")
  app.listen(process.env.PORT, () => console.log("server is up and running"))
})
