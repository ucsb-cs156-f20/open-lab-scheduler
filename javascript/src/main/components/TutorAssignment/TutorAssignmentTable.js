import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from "react-bootstrap";
import {asHumanQuarter} from "main/utils/quarter.ts"
import { useHistory } from "react-router-dom";

export default ({tutorAssignments, isInstructor}) => {
    const history = useHistory();

    const renderEditButton = (id) => {
        return (
            <Button data-testid="edit-button" onClick={() => {history.push(`/tutorAssignments/edit/${id}`) }}>Edit</Button>
        )
    }

    const renderDeleteButton = (_id) => {
        return (
            <Button variant="danger" data-testid="delete-button" >Delete</Button>
        )
    }

    const renderTutorName = (row) => row.tutor.firstName + " " +row.tutor.lastName;
    const renderCourseNameYear = (row) => {
        const quarter = row.course.quarter;
        return row.course.name + " " + asHumanQuarter(quarter);
    }

    const columns = [{
        dataField: 'id',
        text: 'id'
    }, {
        dataField: 'courseNameYear',
        isDummyField: true,
        text: 'Course',
        formatter: (_cell, row) => renderCourseNameYear(row)
    }, {
        dataField: 'tutorName',
        isDummyField: true,
        text: 'Tutor',
        formatter: (_cell, row) => renderTutorName(row)
    }, {
        dataField: 'assignmentType',
        text: 'Assignment Type'
    }];

    if (isInstructor) {
        columns.push({
            text: "Edit",
            isDummyField: true,
            dataField: "edit",
            formatter: (_cell, row) => renderEditButton(row.id)
        });
        columns.push({
            text: "Delete",
            isDummyField: true,
            dataField: "delete",
            formatter: (_cell, row) => renderDeleteButton(row.id)
        });
    }

    return (
        <BootstrapTable keyField='id' data={tutorAssignments} columns={columns} />
    );
}