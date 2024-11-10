import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TopNav from "../TopNav";

const renderWithRouter = (initialPath: string) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<TopNav />} />
        <Route path="/create-user" element={<div>Create User Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("TopNav", () => {
  test("should render TopNav with correct tabs and selected tab based on location", () => {
    renderWithRouter("/");
    expect(screen.getByText("List of Users")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("Create User")).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });
});
