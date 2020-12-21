import React from "react"
import ReactDOM from "react-dom"
import "../node_modules/bootstrap/dist/css/bootstrap.css"

import { Provider } from "react-redux"
import store from "./store"

import HomeGuest from "./components/HomeGuest"

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <HomeGuest />
      </div>
    </Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)
