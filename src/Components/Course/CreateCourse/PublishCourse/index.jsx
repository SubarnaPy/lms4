import React from 'react'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { editCourseDetails } from "../../../../Redux/courseSlice"
import { resetCourseState, setStep } from"../../../../Redux/courseSlice"
import { COURSE_STATUS } from "../../../../utils/constants"
import { Button } from '@material-tailwind/react'
// import IconBtn from "../../../../common/IconBtn"

const PublishCourse = () => {
  const {register, handleSubmit, setValue, getValues} = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {token} = useSelector((state)=> state.auth)
  const {course} = useSelector((state)=> state.course)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(course?.status=== COURSE_STATUS.PUBLISHED){
      setValue("public", true)
    }
  }, [])
  
  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  const handleCoursePublish = async ()=> {
    if(
      (course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public")===false) 
    ){
      goToCourses();
      return
    }

    const formData = new FormData()
    formData.append("courseId", course._id)
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT
    formData.append("status", courseStatus)
    setLoading(true)
    const result = await dispatch(editCourseDetails(formData))
    if (result) {
      goToCourses()
    }
    setLoading(false)
  }

  const onSubmit = (data) => {
    // console.log(data)
    handleCoursePublish()
  }
  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="w-4 h-4 border-gray-300 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this course as public
            </span>
          </label>
        </div>

        {/* Next Prev Button */}
        <div className="flex items-center ml-auto max-w-max gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>
          <button
            disabled={loading}
            type="submit"
            
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            publish
          </button>
          {/* <Button disabled={loading} className='text-black' text="Save Changes" type='submit' /> */}
        </div>
      </form>
    </div>
  )
}

export default PublishCourse