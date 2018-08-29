import React, { Component } from "react"
import { Provider } from "mobx-react"
import { IconButton } from "@material-ui/core"
import { Close } from "@material-ui/icons"

import SelectCourse from "./SelectCourse"

import store from "../stores/RootStore"

export default class App extends Component {
  componentDidMount() {
    store.setWindow()
  }

  render() {
    return (
      <div style={{ background: "white" }}>
        {/*         <a id="sideNavClose" href="javascript:void(0)" className="closebtn">
          &times;
        </a> */}
        <IconButton color="inherit" size="small" id="sideNavClose" style={{ position: "absolute", top: 0, right: 0 }}>
          <Close />
        </IconButton>
        <Provider store={store}>
          <SelectCourse />
        </Provider>
      </div>
    )
  }
}
