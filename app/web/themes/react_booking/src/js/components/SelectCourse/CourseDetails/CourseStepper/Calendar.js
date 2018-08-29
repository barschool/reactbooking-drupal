import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { scaleTime } from "d3-scale"
import { select } from "d3-selection"
// eslint-disable-next-line
import { selectAll } from "d3-selection-multi"
import { timeMonth, timeWeek /* timeDay  */ } from "d3-time"
import moment from "moment"

class Calendar extends Component {
  constructor(props) {
    super(props)
    this.createCalendar = this.createCalendar.bind(this)
  }

  state = {
    height: 0,
  }

  componentDidMount() {
    const rowHeight = 30
    const height = this.getRowHeaders().length * rowHeight + rowHeight
    this.setState({ height })
    this.createCalendar()
  }

  componentDidUpdate() {
    const rowHeight = 30
    const height = this.getRowHeaders().length * rowHeight + rowHeight
    if (height !== this.state.height) this.setState({ height })
    this.createCalendar()
  }

  getRowHeaders = () => {
    return this.props.store.CourseStore.filteredCourses.reduce((labels, course) => {
      if (labels.findIndex(label => label.label === course.languageName) === -1) {
        labels.push({ type: "language", label: course.languageName })
      }
      const langDestIndex = labels.findIndex(
        label => label.label === course.destinationName && label.language === course.languageName
      )
      if (langDestIndex === -1) {
        labels.push({ type: "destination", language: course.languageName, label: course.destinationName })
      }
      return labels
    }, [])
  }

  createCalendar() {
    const node = this.node
    const data = this.props.store.CourseStore.filteredCourses
    if (!data.length) return null

    select(node)
      .selectAll("g")
      .remove()

    const rowHeight = 30
    const rowHeaderWidth = 120
    const selectedCourseStart = moment(
      this.props.activeStep ? data[this.props.activeStep].date.start : data[0].date.start
    )

    let tickSize = timeMonth
    // eslint-disable-next-line
    let tickOffset = "month"
    // eslint-disable-next-line
    let xScaleFormat = ""
    let scaleStartDate = selectedCourseStart.startOf("month")
    let scaleEnd = moment(scaleStartDate)
      .add(2, "months")
      .endOf("month")

    const duration = moment.duration(data[0].date.end.diff(data[0].date.start))
    if (duration.asDays() < 0) {
      // Disabled for now, need more work to make the timescale variable
      tickSize = timeWeek
      // eslint-disable-next-line
      tickOffset = "week"
      scaleStartDate = selectedCourseStart.startOf("week")
      scaleEnd = moment(scaleStartDate)
        .add(1, "week")
        .endOf("week")
    }

    const xScale = scaleTime()
      .domain([scaleStartDate, scaleEnd])
      .range([rowHeaderWidth, this.props.size[0]])

    const ticks = xScale.ticks(tickSize, 1).map(tick => {
      return {
        start: tick,
        end: moment(tick).add(1, "month"),
      }
    })

    const yearLabel = select(node)
      .append("g")
      .attr("class", "yearLabel")

    yearLabel.append("rect").attrs({
      x: 0,
      y: 0,
      width: rowHeaderWidth,
      height: rowHeight,
      fill: "#f2f2f2",
    })

    yearLabel
      .append("text")
      .text(scaleStartDate ? scaleStartDate.format("YYYY") : "year")
      .attrs({
        x: rowHeaderWidth / 2,
        y: rowHeight / 2,
        fill: "#ababab",
        "text-anchor": "middle",
        "dominant-baseline": "central",
      })
    const courses = select(node)
      .append("g")
      .attr("class", "courses")

    const courseItems = courses
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")

    const rowHeaderLabels = this.getRowHeaders()

    courseItems
      .append("rect")
      .attrs({
        class: "course",
        x: d => xScale(d.date.start),
        y: d =>
          rowHeaderLabels.findIndex(row => row.label === d.destinationName && row.language === d.languageName) *
            rowHeight +
          rowHeight +
          2,
        width: d => xScale(d.date.end) - xScale(d.date.start),
        height: rowHeight - 2,
        fill: (d, i) => (i === this.props.activeStep ? "#909090" : "#d5d5d5"),
      })
      .on("click", (d, i) => this.props.onCourseClick(i))

    courseItems.append("circle").attrs({
      cx: d => xScale(d.date.start) + 10,
      cy: d =>
        rowHeaderLabels.findIndex(row => row.label === d.destinationName && row.language === d.languageName) *
          rowHeight +
        rowHeight +
        10,
      r: "3",
      fill: d => (d.campaign ? "#fff" : "rgba(0,0,0,0)"),
    })

    const rowHeaders = select(node)
      .append("g")
      .attr("class", "rowLabels")

    const rows = rowHeaders
      .selectAll("g")
      .data(rowHeaderLabels)
      .enter()
      .append("g")

    rows.append("rect").attrs({
      class: d => d.type,
      x: 0,
      y: (d, i) => i * rowHeight + rowHeight,
      width: rowHeaderWidth,
      height: rowHeight,
      fill: d => (d.type === "language" ? "#d8d8d8" : "#aeaeae"),
    })

    rows.append("line").attrs({
      class: d => d.type,
      x1: 0,
      x2: rowHeaderWidth,
      y1: (d, i) => i * rowHeight + rowHeight * 2,
      y2: (d, i) => i * rowHeight + rowHeight * 2,
      stroke: d => (d.type === "language" ? "rgb(0,0,0,0)" : "white"),
      strokeWidth: 1,
    })

    rows
      .append("text")
      .text(d => d.label)
      .attrs({
        class: "text",
        x: rowHeaderWidth / 2,
        y: (d, i) => i * rowHeight + rowHeight * 1.5,
        fill: d => (d.type === "language" ? "#878787" : "#f6f6f6"),
        "text-anchor": "middle",
        "dominant-baseline": "central",
      })

    const timeAxes = select(node)
      .append("g")
      .attr("class", "timeAxes")

    const months = timeAxes
      .selectAll("g")
      .data(ticks)
      .enter()
      .append("g")
      .attr("class", "test")

    months.append("rect").attrs({
      x: d => xScale(d.start),
      y: 0,
      width: d => xScale(d.end) - xScale(d.start),
      height: rowHeight,
      fill: (d, i) => (i % 2 ? "#d8d8d8" : "#e5e5e5"),
    })

    months
      .append("text")
      .text(d => this.props.store.strings.monthNames[d.start.getMonth()])
      .attrs({
        class: "text",
        x: d => xScale(d.start) + (xScale(d.end) - xScale(d.start)) / 2,
        y: rowHeight / 2,
        fill: "#777",
        "text-anchor": "middle",
        "dominant-baseline": "central",
        style: "font-size: 12px",
      })
  }
  render() {
    return <svg ref={node => (this.node = node)} width={this.props.size[0]} height={this.state.height} />
  }
}

export default inject("store")(observer(Calendar))
