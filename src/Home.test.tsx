import { render, screen } from "@testing-library/react";
import Home from "./Home";

test("renders home", () => {
  render(<Home />);
  const titleElement = screen.getByText(/st-func/i);
  expect(titleElement).toBeInTheDocument();
});
