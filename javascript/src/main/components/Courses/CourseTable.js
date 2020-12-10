import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import useSWR from "swr";
import { fetchWithoutToken } from "main/utils/fetch";

import { buildDeleteCourse } from "main/services/Courses/CourseService";


export default ({ courses, admin, deleteCourse }) => {
    const history = useHistory();
    const { data: filter } = useSWR(
        "/api/public/filter",
        fetchWithoutToken
    );

    if (filter && courses && filter.length > 0 &&filter[0].activeQuarter !== "All") {
        if (filter.length > 0 &&filter[0].activeQuarter != "All") {


            courses = !admin ? courses.filter((course) => course.quarter === filter[0].activeQuarter) : courses;
        }
    }
    const renderEditButton = (id) => {
        return (
            <Button data-testid="edit-button" onClick={() => { history.push(`/courses/edit/${id}`) }}>Edit</Button>
        )
    }

    const renderDeleteButton = (id) => {
        return (
            <Button variant="danger" data-testid="delete-button" onClick={() => deleteCourse(id)}>Delete</Button>
        )
    }

    const columns = [{
        dataField: 'id',
        text: 'id'
    }, {
        dataField: 'name',
        text: 'Course Number'
    }, {
        dataField: 'quarter',
        text: 'Quarter'
    }, {
        dataField: 'instructorFirstName',
        text: 'First'
    }, {
        dataField: 'instructorLastName',
        text: 'Last'
    }, {
        dataField: 'instructorEmail',
        text: 'Email'
    }];

    if (admin) {
        columns.push({
            text: "Edit",
            isDummyField: true,
            dataField: "edit",
            formatter: (cell, row) => renderEditButton(row.id)
        });
        columns.push({
            text: "Delete",
            isDummyField: true,
            dataField: "delete",
            formatter: (cell, row) => renderDeleteButton(row.id)
        });
    }

    return (
        <BootstrapTable keyField='id' data={courses} columns={columns} />
    );
}
