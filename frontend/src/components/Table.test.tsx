import { render, screen } from "@testing-library/react";
import TableComponent from "./Table.tsx";
import { UserType } from "../types/types.ts";

// Mock data
const usersList: UserType[] = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    emailId: "john.doe@example.com",
  },
  {
    _id: "2",
    firstName: "Jane",
    lastName: "Doe",
    emailId: "jane.doe@example.com",
  },
];

describe("TableComponent", () => {
  it("should render table with user data", () => {
    render(<TableComponent usersList={usersList} />);

    // Check if the user data is rendered correctly
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane.doe@example.com")).toBeInTheDocument();
  });

  it("should render the correct table headers", () => {
    render(<TableComponent usersList={usersList} />);

    // Check if the headers are present in the table
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});
