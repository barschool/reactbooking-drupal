import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"

ReactDOM.render(<App />, document.getElementById("bookingDrawer"))

// bookingDrawer show/hide
document.querySelectorAll("a[href='#booknow']").forEach(item => {
  item.addEventListener("click", () => (document.getElementById("bookingDrawer").style.marginRight = "0px"))
})

document
  .getElementById("sideNavClose")
  .addEventListener("click", () => (document.getElementById("bookingDrawer").style.marginRight = "-350px"))
