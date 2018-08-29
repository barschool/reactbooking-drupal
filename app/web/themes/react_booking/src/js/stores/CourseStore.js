import { decorate, observable, action, computed, autorun } from "mobx"
import moment from "moment"

// eslint-disable-next-line
class courseAPI {
  test = "testapi"
  async get(market) {
    return await fetch(`https://loapreact.ebs.team/rest_api/v3/markets/${market}/ebscourses/`)
      .then(data => data.json())
      .then(data => data.destinations)
  }
}

class mockAPI {
  data = require("./mock/mockCourseData.json")
  async get(market) {
    return this.data.destinations
  }
}

const ucFirst = lower => lower.charAt(0).toUpperCase() + lower.substr(1)
const ucWords = (string, numWords) =>
  string
    .split("-")
    .splice(0, numWords)
    .map(word => ucFirst(word))
    .join(" ")

class CourseStore {
  constructor(rootStore) {
    this.rootStore = rootStore
    autorun(() => {
      new mockAPI().get(this.rootStore.market).then(destinations => this.flattenCourses(destinations))
    })
    if (rootStore.lang !== "en") {
      this.selectedlanguages.push("sv")
    }
  }

  courses = []
  step = ""
  selectedCourseType = {}
  selectedCourse = {}
  selectedlanguages = ["en"]
  selecteddestinations = ["stockholm", "new-york"]
  dialogs = { languages: false, destinations: false }
  destinationModalOpen = false

  flattenCourses(destinations) {
    let courses = []

    destinations.forEach(destination => {
      destination.course_types.forEach(type => {
        type.courses.forEach(course => {
          courses.push({
            destination: destination.destination_ref,
            courseType: type.course_type_ref,
            language: course.course_language_code,
            bookable: course.bookable,
            bookUrl: course.book_url,
            accommodation: {
              available: course.accommodation !== 0,
              price: parseFloat(course.accommodation_price),
            },
            time: {
              label: course.course_time,
              start: course.coursetime_start,
              end: course.coursetime_end,
            },
            date: {
              start: moment(course.date_start),
              end: moment(course.date_end),
            },
            price: parseFloat(course.price),
            currency: course.price_currency,
            uniqueId: course.unique_id,
          })
        })
      })
    })

    this.setCourses(courses)
  }

  setCourses(courses) {
    this.courses = courses
  }

  selectCourseType(courseType) {
    this.selectedCourseType = courseType
    this.step = "course-details"
  }

  resetCourseType = () => {
    this.selectedCourseType = {}
    this.step = ""
  }

  selectCourse = course => {
    this.selectedCourse = course
    this.step = "course-addons"
  }

  resetCourse = () => {
    this.selectedCourse = {}
    this.step = "course-details"
  }

  setStep = step => {
    this.step = step
  }

  toggleDest = dest => {
    const index = this.selecteddestinations.indexOf(dest)
    if (index === -1) this.selecteddestinations.push(dest)
    else this.selecteddestinations.splice(index, 1)
  }

  toggleLanguage = language => {
    const index = this.selectedlanguages.indexOf(language)
    if (index === -1) this.selectedlanguages.push(language)
    else this.selectedlanguages.splice(index, 1)
  }

  get languages() {
    return this.courses
      .filter(course => this.selectedCourseType.card.types.indexOf(course.courseType) !== -1)
      .map(course => {
        return {
          key: course.language,
          selected: this.selectedlanguages.indexOf(course.language) !== -1,
        }
      })
      .reduce((unique, language) => {
        if (unique.findIndex(item => item.key === language.key) === -1) unique.push(language)
        return unique
      }, [])
    /* .sort((a, b) => (a.selected === b.selected ? 0 : a.selected ? -1 : 1)) */
  }

  get destinations() {
    return this.courses
      .filter(course => this.selectedCourseType.card.types.indexOf(course.courseType) !== -1)
      .map(course => {
        return {
          key: course.destination,
          value: ucWords(course.destination, 2),
          selected: this.selecteddestinations.indexOf(course.destination) !== -1,
        }
      })
      .reduce((unique, destination) => {
        if (unique.findIndex(item => item.key === destination.key) === -1) unique.push(destination)
        return unique
      }, [])
      .sort((a, b) => (a.selected === b.selected ? 0 : a.selected ? -1 : 1))
  }

  get courseList() {
    return [
      {
        group: "bar",
        cards: [
          {
            id: "international",
            types: ["4-week-international", "3-week-international"],
            from: "flex",
          },
          { id: "mixology", types: ["2-day-mixology"], from: "basic" },
          { id: "flair", types: ["2-days-working-flair"], from: "basic" },
          { id: "advancedBar", types: ["advanced-bartender-c"], from: "basic" },
          { id: "advancedFlair", types: ["advanced-flair-cours"], from: "basic" },
          { id: "barista", types: ["instructor-academy"], from: "basic" },
        ],
      },
      {
        group: "spiritTrips",
        cards: [
          { id: "whiskey", types: ["scotch-whisky"], from: "basic" },
          { id: "tequila", types: ["tequila-and-mezcal"], from: "basic" },
        ],
      },
    ].map(group => {
      group.cards.map(card => {
        card.destinations = []
        card.lowestPrice = 100000000
        this.courses
          .filter(course => card.types.indexOf(course.courseType) !== -1)
          .forEach(({ destination, price, courseType }) => {
            if (card.types.indexOf(courseType) > -1 && card.destinations.indexOf(destination) === -1) {
              card.destinations.push(destination)
            }
            if (price < card.lowestPrice) {
              card.lowestPrice = price
            }
          })
        return card
      })
      return group
    })
  }

  toggleDialog = dialog => {
    this.dialogs[dialog] = !this.dialogs[dialog]
  }

  get filteredCourses() {
    if (
      this.selectedlanguages.length === 0 ||
      this.selecteddestinations.length === 0 ||
      !this.selectedCourseType.group
    ) {
      return []
    } else {
      return this.courses
        .filter(course => this.selectedCourseType.card.types.indexOf(course.courseType) !== -1)
        .filter(course => {
          return this.selectedlanguages.indexOf(course.language) !== -1
        })
        .filter(course => {
          return this.selecteddestinations.indexOf(course.destination) !== -1
        })
        .sort((a, b) => (a.destination < b.destination ? -1 : 1))
        .sort((a, b) => (a.date.start < b.date.start ? -1 : 1))
        .map(course => {
          course.destinationName = ucWords(course.destination, 2)
          course.languageName = this.rootStore.strings.languages[course.language]
          course.campaign = true
          return course
        })
    }
  }
}

decorate(CourseStore, {
  courses: observable,
  step: observable,
  selectedCourseType: observable,
  selectedCourse: observable,
  selecteddestinations: observable,
  setCourses: action,
  selectCourseType: action,
  selectCourse: action,
  resetCourseType: action,
  setStep: action,
  languages: computed,
  selectedlanguages: observable,
  destinations: computed,
  toggleDest: action,
  toggleLanguage: action,
  dialogs: observable,
  toggleDialog: action,
  filteredCourses: computed,
})

export default CourseStore
