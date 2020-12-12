import React from "react";
import { render, waitFor } from "@testing-library/react";
import QuarterFilter from "main/pages/Admin/QuarterFilter";

import { useAuth0 } from "@auth0/auth0-react";
jest.mock("@auth0/auth0-react");

import userEvent from "@testing-library/user-event";
import useSWR from "swr";
jest.mock("swr");
import { useHistory } from 'react-router-dom';
jest.mock("react-router-dom", () => ({
  useHistory: jest.fn() // and this one too
}));

import { fetchWithToken } from "main/utils/fetch";
jest.mock("main/utils/fetch", () => ({
  fetchWithToken: jest.fn()
}));

import { useToasts } from 'react-toast-notifications'
jest.mock('react-toast-notifications', () => ({
  useToasts: jest.fn()
}));


describe("New Course page test", () => {
  const user = {
    name: "test user",
  };
  const getAccessTokenSilentlySpy = jest.fn();
  const addToast = jest.fn();
  beforeEach(() => {
    useAuth0.mockReturnValue({
      admin: undefined,
      getAccessTokenSilently: getAccessTokenSilentlySpy,
      user: user
    });
    useToasts.mockReturnValue({
      addToast: addToast
    })
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<QuarterFilter />);
  });
  test("clicking submit button redirects to the home on success", async () => {
    const pushSpy = jest.fn();
    useHistory.mockReturnValue({
      push: pushSpy
    });

    const { getByText } = render(
      <QuarterFilter />
    );

    const submitButton = getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    await waitFor(() => expect(pushSpy).toHaveBeenCalledTimes(1));
    expect(pushSpy).toHaveBeenCalledWith("/");
    await waitFor(() => expect(addToast).toHaveBeenCalledTimes(1));
    expect(addToast).toHaveBeenCalledWith("New filter Saved", { appearance: "success" })

  });
  test("clicking submit button on error says so on toast", async () => {
    fetchWithToken.mockImplementation(
      () => { throw new Error(); });
    const { getByText } = render(
      <QuarterFilter />
    );

    const submitButton = getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);
    await waitFor(() => expect(addToast).toHaveBeenCalledTimes(1));
    expect(addToast).toHaveBeenCalledWith("Error saving filter", { appearance: "error" })

  });
  
  });