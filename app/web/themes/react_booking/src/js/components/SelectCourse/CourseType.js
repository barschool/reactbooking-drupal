import React, { Fragment } from "react"
import { inject, observer } from "mobx-react"
import {
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Grid,
  withStyles,
  Typography,
  Button,
} from "@material-ui/core"

const styles = {
  root2: {
    background: "#f2f2f2",
  },
  card: {
    minWidth: 200,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    marginBottom: 16,
  },
  pos: {
    marginBottom: 12,
  },
  button: {
    marginBottom: 20,
    textTransform: "none",
    width: "80%",
    margin: "0 auto",
  },
}

const CourseType = inject("store")(
  observer(({ classes, store: { CourseStore, strings } }) => {
    const { formatString, courseList } = strings

    const cardItem = (text, style = {}) => (
      <Typography variant="subheading" style={style} className={classes.title} color="textSecondary">
        {text}
      </Typography>
    )

    return (
      <Grid container align="center" justify="center">
        <Grid item xs={12}>
          <Typography variant="title" style={{ fontWeight: 600, padding: "20px 0px" }}>
            {courseList.choose}
          </Typography>
          {CourseStore.courses.length === 0 ? (
            <Card className={classes.card} style={{ margin: "20px 10px", padding: "20px 20px" }}>
              <CircularProgress />
            </Card>
          ) : (
            CourseStore.courseList.map(({ group, cards }) => {
              return (
                <Fragment key={group}>
                  {courseList[group].title && <Typography>{courseList[group].title}</Typography>}
                  {cards.map((card, index) => {
                    const cardStrings = courseList[group][card.id]
                    const numDestinations = card.destinations.length
                    return (
                      <Card key={index} className={classes.card} style={{ margin: "20px 10px", padding: "20px 20px" }}>
                        <CardContent>
                          {cardItem(cardStrings.title, { fontWeight: 600 })}
                          {cardItem(cardStrings.description)}
                          {numDestinations > 0 &&
                            cardItem(
                              formatString(courseList.destinations[numDestinations > 1 ? "many" : "one"], {
                                integer: numDestinations,
                              })
                            )}
                          {cardItem(
                            formatString(
                              courseList.from[card.from],
                              card.from === "flex" ? card.lowestPrice / 3 : card.lowestPrice
                            )
                          )}
                        </CardContent>
                        <CardActions>
                          <Button
                            className={classes.button}
                            onClick={() => CourseStore.selectCourseType({ group: group, card: card })}
                            variant="contained"
                            size="medium"
                            color="primary"
                          >
                            Continue
                          </Button>
                        </CardActions>
                      </Card>
                    )
                  })}
                </Fragment>
              )
            })
          )}
        </Grid>
      </Grid>
    )
  })
)

export default withStyles(styles)(CourseType)
