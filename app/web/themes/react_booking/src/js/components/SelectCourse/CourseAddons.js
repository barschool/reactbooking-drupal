import React from "react"
import { inject, observer } from "mobx-react"
import { Button, Card, Grid, withStyles, Typography, Switch } from "@material-ui/core"

const styles = {
  small: {
    textTransform: "none",
    fontSize: 12,
  },
}

const ucWords = (string, numWords) => {
  return string
    .split("-")
    .splice(0, numWords)
    .map(word => word.charAt(0).toUpperCase() + word.substr(1))
    .join(" ")
}

class CourseAddons extends React.Component {
  state = {
    accommodatation: false,
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  render() {
    const {
      classes,
      store: { CourseStore, strings },
    } = this.props
    const { courseList, courseDetails, courseAddons } = strings
    const { group, card } = CourseStore.selectedCourseType
    const course = CourseStore.selectedCourse

    return (
      <Grid container>
        <Grid item xs={5} onClick={() => CourseStore.setStep("course-details")} style={{ cursor: "pointer" }}>
          <Typography variant="body1" className={classes.small}>
            &lt; {courseAddons.title}
          </Typography>
        </Grid>

        <Grid item xs={6} style={{ borderLeft: "1px solid #aaa", paddingLeft: 10 }}>
          <Typography variant="subheading" className={classes.small}>
            {courseDetails.selected}
          </Typography>
          <Typography variant="subheading" style={{ fontWeight: "bold" }} className={classes.small}>
            {courseList[group][card.id].title}
          </Typography>
          <Typography variant="caption" style={{ fontWeight: "bold" }} className={classes.small}>
            {CourseStore.selectedCourse.language.toUpperCase()} - {course.date.start.format("D MMM")} to{" "}
            {course.date.end.format("D MMM")} - {ucWords(CourseStore.selectedCourse.destination, 2)}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.card} style={{ margin: "20px 10px", padding: "20px 20px" }}>
            <Typography variant="title" className={classes.title}>
              {courseAddons.time}
            </Typography>

            <Typography variant="body2" className={classes.title}>
              {course.time.start} - {course.time.end}
            </Typography>
            <Button variant="contained" color="primary">
              Select
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.card} style={{ margin: "20px 10px", padding: "20px 20px" }}>
            <Typography variant="title" className={classes.title}>
              {courseAddons.title}
            </Typography>

            <Grid container alignItems="center">
              <Grid item xs={6}>
                <Typography variant="subheading" style={{ flex: 1 }}>
                  {courseAddons.toggleAccommodation}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Switch
                  style={{ textAlign: "right" }}
                  checked={this.state.checkedB}
                  onChange={this.handleChange("accommodatation")}
                  value="accommodatation"
                  color="primary"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

const courseAddons = withStyles(styles)(CourseAddons)

export default inject("store")(observer(courseAddons))
