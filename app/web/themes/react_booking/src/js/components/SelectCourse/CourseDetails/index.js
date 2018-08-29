import React, { Fragment } from "react"
import { inject, observer } from "mobx-react"
import { Card, Chip, Grid, withStyles, Typography, Button } from "@material-ui/core"

import ToggleDialog from "./ToggleDialog"
import CourseStepper from "./CourseStepper"

const styles = {
  card: {
    minWidth: 200,
  },
  title: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 20,
    textTransform: "none",
    width: "32%",
    "&:not(:first-of-type)": {
      marginLeft: "2%",
    },
  },
  small: {
    textTransform: "none",
    fontSize: 12,
  },
}

const CourseDetails = inject("store")(
  observer(({ classes, store, store: { CourseStore, strings } }) => {
    const { courseList, courseDetails } = strings
    const { group, card } = CourseStore.selectedCourseType

    const languageSelect = () => {
      const selected = CourseStore.languages.filter(lang => lang.selected)
      return (
        <Fragment>
          {selected.length ? <span>Selected:</span> : null}
          {selected.map(lang => {
            return (
              <Chip
                key={lang.key}
                label={strings.languages[lang.key]}
                onDelete={() => CourseStore.toggleLanguage(lang.key)}
                style={{ marginLeft: 5 }}
              />
            )
          })}

          <br />
          <br />
          {CourseStore.languages.filter(item => [store.lang, "en"].indexOf(item.key) !== -1).map(lang => {
            const selected = CourseStore.selectedlanguages.indexOf(lang.key) !== -1
            return (
              <Button
                key={lang.key}
                disabled={selected || CourseStore.selectedlanguages.length > 2}
                onClick={() => CourseStore.toggleLanguage(lang.key)}
                variant="contained"
                className={classes.button}
              >
                {strings.languages[lang.key]}
              </Button>
            )
          })}

          {
            <ToggleDialog
              dialogkey="languages"
              open={CourseStore.dialogs.languages}
              funcname="toggleLanguage"
              items={CourseStore.languages.map(lang => {
                lang.value = strings.languages[lang.key]
                return lang
              })}
              title={courseDetails.language.change}
            />
          }
          <br />
          <Button
            variant="outlined"
            disabled={selected.length > 2}
            onClick={() => CourseStore.toggleDialog("languages")}
            style={{ textTransform: "none", textDecoration: "underline" }}
          >
            {courseDetails.language.change}
          </Button>
        </Fragment>
      )
    }

    return (
      <Grid container>
        <Grid item xs={5} onClick={CourseStore.resetCourseType} style={{ cursor: "pointer" }}>
          <Typography variant="body1" className={classes.small}>
            &lt; {courseDetails.courseSelection}
          </Typography>
        </Grid>
        <Grid item xs={6} style={{ borderLeft: "1px solid #aaa", paddingLeft: 10 }}>
          <Typography variant="subheading" className={classes.small}>
            {courseDetails.selected}
          </Typography>
          <Typography variant="subheading" style={{ fontWeight: "bold" }} className={classes.small}>
            {courseList[group][card.id].title}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.card} style={{ margin: "20px 10px", padding: "20px 20px" }}>
            <Typography variant="title" className={classes.title}>
              {/* CourseStore.selectedlanguages.length > 0 ?  */}
              {courseDetails.language.title}
            </Typography>
            {languageSelect()}
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.card} style={{ margin: "20px 10px", padding: "20px 20px" }}>
            <Typography variant="title" className={classes.title}>
              {courseDetails.destination.title}
            </Typography>
            {CourseStore.destinations.slice(0, 3).map(({ value, key }) => {
              const selected = CourseStore.selecteddestinations.indexOf(key) !== -1
              return (
                <Button
                  key={key}
                  onClick={() => CourseStore.toggleDest(key)}
                  color={selected ? "primary" : "default"}
                  variant="contained"
                  className={classes.button}
                >
                  {value}
                </Button>
              )
            })}
            <br />
            {CourseStore.destinations.length > 3 && (
              <Fragment>
                <ToggleDialog
                  dialogkey="destinations"
                  open={CourseStore.dialogs.destinations}
                  funcname="toggleDest"
                  items={CourseStore.destinations}
                  title={courseDetails.destination.change}
                />
                <Typography variant="subheading">{courseDetails.destination.looking}</Typography>
                <Button
                  variant="outlined"
                  onClick={() => CourseStore.toggleDialog("destinations")}
                  style={{ textTransform: "none", textDecoration: "underline" }}
                >
                  {courseDetails.destination.change}
                </Button>
              </Fragment>
            )}
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.card} style={{ margin: "20px 10px", padding: "20px 20px" }}>
            <Typography variant="title" style={{ marginBottom: 20 }}>
              {courseDetails.dates.title}
            </Typography>
            {CourseStore.filteredCourses.length && <CourseStepper />}
          </Card>
        </Grid>
      </Grid>
    )
  })
)

export default withStyles(styles)(CourseDetails)
