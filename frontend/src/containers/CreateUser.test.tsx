import { render, screen, fireEvent } from "@testing-library/react";
import CreateUser from "./CreateUserContainer";

describe("CreateUser Component", () => {
  test("should render the form with input fields", () => {
    render(<CreateUser />);

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("should validate and show error when fields are invalid", async () => {
    render(<CreateUser />);

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/First name should contain only letters/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Last name should contain only letters/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Please enter a valid email address/i)
    ).toBeInTheDocument();
  });
});
