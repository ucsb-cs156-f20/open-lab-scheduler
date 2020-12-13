import React, { useState } from "react";
import { fetchWithToken } from "main/utils/fetch";
import useSWR from "swr";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "main/components/Loading/Loading";
import {asHumanQuarter} from "main/utils/quarter.ts"
import { Form, Button, Row, Col, Container } from "react-bootstrap";

const TutorAssignmentForm = ({ createTutorAssignment, updateTutorAssignment, existingTutorAssignment }) => {
    const emptyTutorAssignment = {
        course: null,
        tutor: null,
        tutorEmail: "",
        assignmentType: "LA",
        index: null, 
        id: null
    }

    const [existingSet, setExistingSet] = useState(false);
    const [tutorAssignment, setTutorAssignment] = useState(emptyTutorAssignment);

    if(existingTutorAssignment && !existingSet){
        setTutorAssignment({course: existingTutorAssignment.course, 
            tutor: existingTutorAssignment.tutor,
            tutorEmail: existingTutorAssignment.tutor.email, 
            assignmentType: existingTutorAssignment.assignmentType, 
            index: null, 
            id: existingTutorAssignment.id});
        setExistingSet(true);
    }

    const { getAccessTokenSilently: getToken } = useAuth0();
    const { data: courseList, error, mutate: mutateCourse } = useSWR(
        ["/api/member/courses/", getToken],
        fetchWithToken
    );

    let sortedList;
    if (error) {
        return (
            <>
            <h1>You must be an instructor or an admin to create new Tutor Assignments.</h1>
            </>
        );
    }
    if (!courseList) {
        return <Loading />;
    }
    else {
        sortedList = courseList.map((course, index) => <option key={index} value={index}>{course.number+" "+asHumanQuarter(course.quarter)}</option>);
        if(tutorAssignment.course === null){
            setTutorAssignment({...tutorAssignment, course: courseList[0], index: 0});
        }
    }

    
    if(existingTutorAssignment && tutorAssignment.index === null){
        courseList.map((course, index) => {
            if(course.id === existingTutorAssignment.course.id){
                setTutorAssignment({...tutorAssignment, index: index});
            }
        });
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (createTutorAssignment){
            createTutorAssignment(tutorAssignment);
        }
        else{
            updateTutorAssignment(tutorAssignment, tutorAssignment.id);
        }
    }

    return (
        <>
            {tutorAssignment.index !== null ? 
            <Form onSubmit={handleOnSubmit}>
                <Form.Group as={Row} controlId="courseNumber">
                    <Form.Label column sm={2}>Course Number</Form.Label>
                    <Col sm={10}>
                        <Form.Control as="select" value={tutorAssignment.index} onChange={(e) => setTutorAssignment({ 
                            ...tutorAssignment, course: courseList[e.target.value], index: e.target.value})}>
                            {sortedList}
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="tutorEmail">
                    <Form.Label column sm={2}>
                        Tutor Email
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="tutor email" value={tutorAssignment.tutorEmail} onChange={(e) => setTutorAssignment({
                            ...tutorAssignment,
                            tutorEmail: e.target.value
                        })} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="assignmentType">
                    <Form.Label column sm={2}>Assignment Type</Form.Label>
                    <Col sm={10}>
                        <Form.Control as="select" value={tutorAssignment.assignmentType} onChange={(e) => setTutorAssignment({ 
                            ...tutorAssignment, assignmentType: e.target.value})}>
                            <option value="LA">LA</option>
                            <option value="190J">190J</option>
                            <option value="TA">TA</option>
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="submit">Submit</Button>
                    </Col>
                </Form.Group>
            </Form>
            :
            <Loading />}
        </>
    );
};

export default TutorAssignmentForm;
