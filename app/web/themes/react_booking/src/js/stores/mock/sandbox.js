const fs = require("fs")

const { destinations } = JSON.parse(fs.readFileSync("./tmp.json"))

const types = destinations.reduce((types, { destination_ref, course_types }) => {
  course_types.map(({ courses, course_type_ref }, index) => {
    let id = types.findIndex(type => type.id === course_type_ref)
    if (id === -1) {
      id = index
      types.push({ id: course_type_ref, destinations: [{ id: destination_ref, courses: courses }] })
    } else {
      if (types[id].destinations.findIndex(d => d === destination_ref))
        types[id].destinations.push({ id: destination_ref, courses: courses })
    }
  })
  return types
}, [])

const courseTypeNames = [
  {
    group: "International Bartender Course",
    concatenate: true,
    title: "",
    from: "flexible payment options, first rate from $50$",
    items: [
      { id: "4-week-international", description: "3 or 4 weeks course" },
      { id: "3-week-international", description: "3 or 4 weeks course" },
    ],
  },
  { id: "2-day-mixology", title: "Mixology", description: "Two days course", from: "from 250$" },
  { id: "2-days-working-flair", title: "Working Flair", description: "Two days course", from: "from 250$" },
  { id: "advanced-bartender-c", title: "Advanced Bartending", description: "Five days course", from: "from 250$" },
  { id: "advanced-flair-cours", title: "Advanced Flair", description: "Five days course", from: "from 250$" },
  { id: "instructor-academy", title: "Instructor Academy", description: "Ten days course", from: "from 250$" },
  { id: "barista-academy", title: "Barista Academy", description: "Five days course", from: "from 250$" },
  {
    group: "Spirit trips",
    concatenate: false,
    from: "from 1000$",
    items: [
      { id: "scotch-whisky", title: "Schotch Whisky Expedition", description: "Two weeks expedition" },
      { id: "tequila-and-mezcal", title: "Tequila and Mezcal Expedition", description: "Two weeks expedition" },
    ],
  },
]

courseTypeNames.map(item => {
  if (item.group && item.concatenate) {
    const destinations = item.items
      .reduce((allDestinations, { id }) => {
        const course = types.find(type => type.id === id)
        return allDestinations.concat(({ id } = course.destinations.map(dest => dest.id)))
      }, [])
      .reduce((unique, destination) => {
        if (unique.length === 0 || unique.indexOf(destination) === -1) unique.push(destination)
        return unique
      }, [])
    item.numDestinations = destinations.length
  } else if (item.group) {
    item.items.map(item => (item.numDestinations = types.find(type => type.id === item.id).destinations.length))
  } else {
    item.numDestinations = types.find(type => type.id === item.id).destinations.length
  }
})

//console.log(types[1])
