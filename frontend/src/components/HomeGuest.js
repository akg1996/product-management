import React, { useState } from "react"
import Login from "./Login"
import Register from "./Register"

function HomeGuest() {
  const [state, setState] = useState(true)

  return <div>{state ? <Login state={state} setState={setState} /> : <Register state={state} setState={setState} />}</div>
}

export default HomeGuest
