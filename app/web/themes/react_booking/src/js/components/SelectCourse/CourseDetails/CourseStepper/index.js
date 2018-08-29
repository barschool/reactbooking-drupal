import React from "react"
import { inject, observer } from "mobx-react"
import { Button, Grid, MobileStepper, Typography, withStyles } from "@material-ui/core"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons"
import SwipeableViews from "react-swipeable-views"

import Calendar from "./Calendar"

const styles = {
  root: {
    flexGrow: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
  },
  img: {
    height: 255,
    maxWidth: 400,
    overflow: "hidden",
    width: "100%",
  },
}

const ucWords = (string, numWords) => {
  return string
    .split("-")
    .splice(0, numWords)
    .map(word => word.charAt(0).toUpperCase() + word.substr(1))
    .join(" ")
}

class CourseStepper extends React.Component {
  state = {
    activeStep: 0,
  }

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }))
  }

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }))
  }

  handleStepChange = activeStep => {
    this.setState({ activeStep })
  }

  handleSelectCourse = course => {
    this.props.store.CourseStore.selectCourse(course.destination)
  }

  render() {
    const {
      classes,
      store: {
        CourseStore: {
          filteredCourses,
          selectCourse,
          // eslint-disable-next-line
          selectedCourseType,
          selectedCourseType: { group, card },
        },
        strings: { courseList },
        windowWidth,
      },
    } = this.props
    const { activeStep } = this.state
    const maxSteps = filteredCourses.length

    return (
      <div className={classes.root}>
        <Calendar size={[windowWidth - 80, 250]} activeStep={activeStep} onCourseClick={this.handleStepChange} />
        <Typography align="center" variant="caption" style={{ marginBottom: 20 }}>
          <svg width={8} height={8} style={{ marginRight: 5 }}>
            <circle cx="4" cy="4" r="4" fill="#ababab" />
          </svg>{" "}
          Courses with active promotion
        </Typography>
        <SwipeableViews
          axis="x"
          style={{ textAlign: "center" }}
          index={this.state.activeStep}
          onChangeIndex={this.handleStepChange}
          enableMouseEvents
        >
          {filteredCourses.map(course => (
            <div key={course.uniqueId}>
              <Typography align="center">
                <b>
                  {course.date.start.format("D MMM")} to {course.date.end.format("D MMM")}
                </b>{" "}
                - 4 weeks
              </Typography>
              <Typography align="center">
                {courseList[group][card.id].title} - {course.language.toUpperCase()} - {ucWords(course.destination, 2)}
              </Typography>
              <Grid container style={{ padding: 20 }}>
                <Grid item xs={8}>
                  <Typography align="left" variant="subheading">
                    Price
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography align="right" variant="title">
                    {course.price} {course.currency}
                  </Typography>
                </Grid>
                <Grid item xs={8} variant="subheading">
                  <Typography align="left">Price of first installment would be</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography align="right" variant="title">
                    {(course.price / 3).toFixed(0)} {course.currency}
                  </Typography>
                </Grid>
              </Grid>
              <Button variant="contained" color="primary" onClick={() => selectCourse(course)}>
                Select this course
              </Button>
            </div>
          ))}
        </SwipeableViews>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          className={classes.mobileStepper}
          variant="progress"
          nextButton={
            <Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </div>
    )
  }
}

const courseStepper = withStyles(styles)(CourseStepper)

export default inject("store")(observer(courseStepper))
