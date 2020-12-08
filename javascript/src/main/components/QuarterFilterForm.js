import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";

const QuarterFilterForm = ({ upsertFilterS}) => {
    const [filterVal, setFilterVal] = useState("");
    const handleOnSubmit = (e) => {
        e.preventDefault();
        upsertFilter(filterVal);
    }
    return (
        <Form onSubmit={handleOnSubmit}>
            <Form.Group as={Row} controlId="name">
                <Form.Label column sm={2}>Enter quarter to filter by</Form.Label>
                <Col sm={10}>
                    <Form.Control type="text" placeholder="enter blank value to filter by all" onChange={
                        (e) => setFilterVal(e.target.value)
                    }
                    />

                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Col sm={{ span: 10, offset: 2 }}>
                    <Button type="submit">Submit</Button>
                </Col>
            </Form.Group>
        </Form >
    );
};

export default QuarterFilterForm;


