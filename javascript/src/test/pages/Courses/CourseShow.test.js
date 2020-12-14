import React from "react";
import { render } from "@testing-library/react";
import useSWR from "swr";
jest.mock("swr");
import { useAuth0 } from "@auth0/auth0-react";
import { useParams} from "react-router-dom";
jest.mock("@auth0/auth0-react");
import CourseShow from "main/pages/Courses/CourseShow";
jest.mock("main/utils/fetch");

jest.mock("react-router-dom", () => ({
  useHistory: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use real functions 
  useParams: jest.fn(), // except for just this one
}));



describe("Course Show Page Test", () => { 
	const course =
	{
	  name: "CMPSC 156",
	  id: 1,
	  quarter: "F20",
	  instructorFirstName: "Phill",
	  instructorLastName: "Conrad",
	  instructorEmail: "phtcon@ucsb.edu",
	};
	
	const user = {
		name: "test user",
	};
	const getAccessTokenSilentlySpy = jest.fn();
  
	beforeEach(() => {
		useAuth0.mockReturnValue({
			admin: undefined,
			getAccessTokenSilently: getAccessTokenSilentlySpy,
			user: user,
		});
		useSWR.mockImplementation((key, getter)=>{
			if (key[0] === "/api/myRole") {
				return { data : {
					role: "Member"
				}};
			} else {
				return {
					data : [course]
				}
			}
		})
		useParams.mockReturnValue({
			courseId: '1'
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
  
    
	test("empty component renders without crashing", () => {
		render(<CourseShow />);
	});

	test("display page with admin access", () => {
		useSWR.mockImplementation((key, getter) => {
			if (key[0] === "/api/myRole") {
				return {
					data: {
						role: "Admin"
					}
				};
			} else {
				return {
					data: [course]
				}
			}
		});
		render(<CourseShow existingCourse={course}/>);
	});

	test("renders loading waiting for viewlist without crashing", () => {
		useSWR.mockImplementation((key, getter) => {
			if (key[0] === "/api/myRole") {
				return {
					data: {
						role: "Member"
					}
				};
			} else {
				return {
					data: null
				}
			}
		});
		const screen = render(<CourseShow />);
		expect(screen.getByAltText("Loading")).toBeInTheDocument();
	});

	test("display error messages", () => {
		useSWR.mockImplementation((key, getter) => {
			if (key[0] === "/api/myRole") {
				return {
					data: {
						role: "Guest"
					}
				};
			} else {
				return {
					data: null,
					error: true
				}
			}
		});
		const screen = render(<CourseShow />);
		expect(screen.getByText("We encountered an error; please reload the page and try again.")).toBeInTheDocument();
	});

	test("display error messages", () => {
		useSWR.mockImplementation((key, getter) => {
			if (key[0] === "/api/myRole") {
				return {
					data: null
				};
			} else {
				return {
					data: null,
					error: true
				}
			}
		});
		const screen = render(<CourseShow />);
		expect(screen.getByText("We encountered an error; please reload the page and try again.")).toBeInTheDocument();
	});
	
	test("component with existing course renders without crashing", () => {
		render(<CourseShow existingCourse={course}/>);
    });
});