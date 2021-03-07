import React from "react";
import { render } from "@testing-library/react";
import OfficeHourTable from "main/components/OfficeHours/OfficeHourTable";


describe("OfficeHour table tests", () => {

  const sampleOfficeHour = [{
    "id": 1,
    "name": "CMPSC 156",
    "quarter": "F20",
    "instructorFirstName": "Phill",
    "instructorLastName": "Conrad",
    "instructorEmail": "phtcon@ucsb.edu"
  }]

  test("renders without crashing", () => {
    render(<OfficeHourTable officeHours = {sampleOfficeHour}/>);
  });


});
