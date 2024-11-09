import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import UserList from "./UsersListContainer";

const mockAxios = new MockAdapter(axios);

describe("UserList Component", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test("should display error message when API request fails", async () => {
    mockAxios.onGet("/api/users").reply(500);

    await act(async () => {
      render(<UserList />);
    });

    // Wait for the error message to appear
    await waitFor(() => screen.getByText(/Failed to fetch users/i));

    // Check if the error message is displayed
    expect(screen.getByText("Failed to fetch users")).toBeInTheDocument();
  });
});
