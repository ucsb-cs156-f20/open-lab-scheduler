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

    const sortCaret = (order, column) => {
        const ascendingON = String.fromCharCode(0x25b2);
        const descendingON = String.fromCharCode(0x25bc);
        const ascendingOFF = String.fromCharCode(0x25b3);
        const descendingOFF = String.fromCharCode(0x25bd);

        if (!order) 
            return (<span data-testid="sort">{descendingOFF}{ascendingOFF}</span>);
        else if (order === 'asc') 
            return (<span data-testid="sort-asc">{descendingOFF}<font color="red">{ascendingON}</font></span>);
        else 
            return (<span data-testid="sort-desc"><font color="red">{descendingON}</font>{ascendingOFF}</span>);
        
    }

    const columns = [{
        dataField: 'id',
        text: 'id',
        sort: true,
        sortCaret: sortCaret
    }, {
        dataField: 'name',
        text: 'Course Number',
        sort: true,
        sortCaret: sortCaret
    }, {
        dataField: 'quarter',
        text: 'Quarter',
        sort: true,
        sortCaret: sortCaret
    }, {
        dataField: 'instructorFirstName',
        text: 'First',
        sort: true,
        sortCaret: sortCaret
    }, {
        dataField: 'instructorLastName',
        text: 'Last',
        sort: true,
        sortCaret: sortCaret
    }, {
        dataField: 'instructorEmail',
        text: 'Email',
        sort: true,
        sortCaret: sortCaret
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
