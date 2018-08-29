import React, { Fragment } from "react"
import { inject, observer } from "mobx-react"

import CourseType from "./CourseType"
import CourseDetails from "./CourseDetails"
import CourseAddons from "./CourseAddons"

const SelectCourse = inject("store")(
  observer(({ store: { CourseStore } }) => {
    return (
      <Fragment>
        {CourseStore.step === "" ? <CourseType /> : null}
        {CourseStore.step === "course-details" ? <CourseDetails /> : null}
        {CourseStore.step === "course-addons" ? <CourseAddons /> : null}
      </Fragment>
    )
  })
)

export default SelectCourse
