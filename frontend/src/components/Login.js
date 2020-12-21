import React, { useState } from "react"
import Axios from "axios"

function Login(props) {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      let response = await Axios.post("http://localhost:8080/login", { username, password })
      if (response.data) {
        localStorage.setItem("libraryToken", response.data.token)
        localStorage.setItem("libraryUsername", response.data.username)
      } else {
        alert("Invalid Username / Password")
      }
    } catch (e) {
      console.log("some error occured")
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4 col-md-offset-4 mx-auto mt-5">
          <div className="login-panel panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Please Sign In</h3>
            </div>
            <div className="panel-body">
              <form onSubmit={handleSubmit}>
                <fieldset>
                  <div className="form-group">
                    <input onChange={e => setUsername(e.target.value)} className="form-control" placeholder="User name" name="username" type="text" autoComplete="off" autoFocus />
                  </div>
                  <div className="form-group">
                    <input onChange={e => setPassword(e.target.value)} className="form-control" placeholder="Password" name="password" type="password" />
                  </div>
                  <button className="btn btn-lg btn-success btn-block">Login</button>
                </fieldset>
              </form>
            </div>
          </div>
          <div className="mb-5">
            <button onClick={e => props.setState(false)} className="btn btn-lg btn-primary btn-block">
              Register Here
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
