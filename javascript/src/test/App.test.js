import React from "react";
import { getAllByText, render, screen, waitFor } from "@testing-library/react";
import App from "main/App";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
jest.mock("@auth0/auth0-react");
import useSWR from "swr";
jest.mock("swr");

describe("App tests", () => {

  const setupSWRMocks = (mockRole) => {
    useSWR.mockImplementation( (firstParam, fetchWithToken) => { 
      const coursesResult = {
        data: []
      };
      const roleResult = {
        data: {
          role: mockRole
        }
      };
      return ( firstParam === "/api/public/courses/" ) ? coursesResult : roleResult;
    });
  };

  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
      getAccessTokenSilently: jest.fn(),
    });
    setupSWRMocks("guest");
  });

  test("renders without crashing", () => {
    const history = createMemoryHistory();
    const { getByTestId } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    const brand = getByTestId("brand");
    expect(brand).toBeInTheDocument();
  });

  test("renders loading when loading", () => {
    useAuth0.mockReturnValueOnce({
      ...useAuth0(),
      isLoading: true,
    });
    const { getByAltText } = render(<App />);
    const loading = getByAltText("Loading");
    expect(loading).toBeInTheDocument();
  });

    // Unfortunately, there is no way to verify that the admin route is available or not. As a result, this test verifies another side-effect of being an admin.
  test("renders admin route when user is admin", async () => {
    setupSWRMocks("admin");
    const history = createMemoryHistory();
    const { getAllByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    //travis koski-this test was causign an error causee it was finding multiple instances of "admin", message me in slack if 
    //me changing it to this is ok.
    expect(getAllByText("Admin")).toBeDefined();
  });
});