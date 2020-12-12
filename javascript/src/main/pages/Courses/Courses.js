import React from "react";
import useSWR from "swr";
import { Button, Dropdown } from "react-bootstrap";
import { fetchWithToken } from "main/utils/fetch";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "main/components/Loading/Loading";
import CourseTable from "main/components/Courses/CourseTable"
import { buildCreateCourse, buildDeleteCourse, buildUpdateCourse } from "main/services/Courses/CourseService";
import { CSVLink } from "react-csv";
import { buildCreateFilter } from "main/services/QuarterFilterService";
import { fetchWithoutToken } from "main/utils/fetch";
import { useHistory } from "react-router-dom";




const Courses = () => {

  const history = useHistory();
  const { getAccessTokenSilently: getToken } = useAuth0();
  const { data: courseList, error, mutate: mutateCourses } = useSWR(
    ["/api/public/courses", getToken],
    fetchWithToken
  );
  const deleteCourse = buildDeleteCourse(getToken, mutateCourses);
  const { data: active } = useSWR(
    "/api/public/filter",
    fetchWithoutToken
  );
  console.log(active);
  if (error) {
    return (
      <h1>We encountered an error; please reload the page and try again.</h1>
    );
  }
  if (!courseList) {
    return <Loading />;
  }


  const headers = [{
    key: 'id',
    label: 'id'
  }, {
    key: 'name',
    label: 'Course Number'
  }, {
    key: 'quarter',
    label: 'Quarter'
  }, {
    key: 'instructorFirstName',
    label: 'First'
  }, {
    key: 'instructorLastName',
    label: 'Last'
  }, {
    key: 'instructorEmail',
    label: 'Email'
  }];

  return (
    <>
      <Button onClick={() => history.push("/courses/new")}>New Course</Button>
      <CourseTable courses={courseList} admin={true} deleteCourse={deleteCourse} />
      <Button><CSVLink style={{color: "white"}} headers={headers} data={courseList} filename = {"CourseTable.csv"}>Download CSV</CSVLink></Button>
    </>
  );

  
};

export default Courses;

