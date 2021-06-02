import React, { useEffect, useState } from "react";
import { fetchWithToken } from "main/utils/fetch";
import useSWR from "swr";
import { useAuth0 } from "@auth0/auth0-react";
import {asHumanQuarter} from "main/utils/quarter.ts"
import { FormControl, Form, Button, Row, Col } from "react-bootstrap";
import OfficeHoursSelector from "main/components/OfficeHours/OfficeHoursSelector";

const TutorNotesForm = ({ createTutorNotes/*, updateTutorNotes, existingTutorNotes*/ }) => {
    const emptyTutorNotes = {
        id: null,
        onlineOfficeHours: null,
        message: "Write message here"
    }

    const initialTutorNotes = emptyTutorNotes;

    const [tutorNotes, setTutorNotes] = useState(initialTutorNotes);
    const [officeHours, setOfficeHours] = useState({})

    const { getAccessTokenSilently: getToken } = useAuth0();

    const { data: officeHoursList, _error } = useSWR(
        ["/api/member/officeHours/", getToken],
        fetchWithToken,
        {initialData:[]}
    );

    useEffect(() => {
        if (officeHoursList && officeHoursList.length){
            setOfficeHours(officeHoursList.length > 0 ? officeHoursList[0] : {});
        }
      }, [officeHoursList]);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (createTutorNotes){
            tutorNotes.onlineOfficeHours = officeHours;
            console.log("tutorNotes = ", tutorNotes);
            console.log("officeHours = ", officeHours);
            createTutorNotes(tutorNotes);
        }
    }
    
    const onOfficeHoursChange = (i) => {
        console.log("office hours change i= " , i);
        console.log("office hours list = ", officeHoursList);
        setOfficeHours(officeHoursList[i]);
    }

    // const tutorName = (tutorNotes) => {
    //     const firstName = tutorNotes?.officeHours?.tutorAssignment?.tutor?.firstName;
    //     const lastName = tutorNotes?.officeHours?.tutorAssignment?.tutor?.lastName;
    //     return firstName + " " + lastName;
    // };

    // const course = (tutorNotes) => {
    //     return tutorNotes?.officeHours?.tutorAssignment?.course?.name;
    // };

    // const quarter = (tutorNotes) => {
    //     const quarter = tutorNotes?.officeHours?.tutorAssignment?.course?.quarter;
    //     return quarter ? asHumanQuarter(quarter) : "";
    // };


    return (
        <>
            <Form onSubmit={handleOnSubmit}>
                {
                    createTutorNotes && <OfficeHoursSelector officeHours={officeHoursList} onChange={onOfficeHoursChange}/>
                }
                <Form.Group as={Row} controlId="message">
                    <Form.Label column sm={2}>Message</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="Write note here" onChange={(e) => setTutorNotes({ 
                            ...tutorNotes, message: e.target.value})}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="submit">Submit</Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
};

export default TutorNotesForm;