import { configure, computed, observable, action, decorate } from "mobx"
import LocalizedStrings from "localized-strings"
import debounce from "lodash/debounce"

import messages from "../messages"
import CourseStore from "./CourseStore"

configure({ enforceActions: "observed" })

class RootStore {
  market = "en"
  lang = "sv"
  strings = {}
  screenWindow = null
  windowWidth = null

  menuItems = ["/courses", "/destinations", "/about", "/faq", "/contact"]
  languages = [
    { key: "en", text: "English" },
    { key: "sv", text: "Swedish" },
    /*  { key: "no", text: "Norwegian" },
    { key: "fi", text: "Finnish" },
    { key: "nl", text: "Dutch" },
    { key: "de", text: "German" },
    { key: "fr", text: "French" },
    { key: "it", text: "Italian" },
    { key: "es", text: "Spanish" },
    { key: "dk", text: "Danish" }, */
  ]

  constructor() {
    this.CourseStore = new CourseStore(this)
    this.strings = new LocalizedStrings(messages)
  }

  setLanguage = languageCode => {
    const newStrings = new LocalizedStrings(messages)
    newStrings.setLanguage(languageCode)
    this.strings = newStrings
    this.lang = languageCode
  }

  get selectableLanguages() {
    return this.languages.filter(lang => lang.key !== this.lang)
  }

  setWindow = () => {
    if (typeof window === "object") {
      this.screenWindow = window
      this.handleWindowWidthChange()
      this.screenWindow.addEventListener("resize", this.handleWindowWidthChange)
    }
  }

  setWindowWidth = width => {
    this.windowWidth = width
    return this.windowWidth
  }

  handleWindowWidthChange = debounce(() => {
    const width = this.screenWindow.innerWidth
    this.setWindowWidth(width)
  }, 100)
}

decorate(RootStore, {
  market: observable,
  lang: observable,
  strings: observable,
  screenWindow: observable,
  windowWidth: observable,
  setWindowWidth: action,
  setLanguage: action,
  selectableLanguages: computed,
})

const store = (window.store = new RootStore())
export default store
