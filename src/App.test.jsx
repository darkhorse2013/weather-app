import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

it("renders weather app heading", () => {
  //render app
  render(<App />);

  //expect weather app text to be displayed
  expect(screen.getByText(/weather app/i)).toBeInTheDocument();
});

it("increments the counter when clicked", async () => {
  const user = userEvent.setup();
  //render app
  render(<App />);
  //find element button
  const button = screen.getByRole("button");
  //perform interaction
  await user.click(button);
  //when clicked expect count to be 1
  expect(button).toHaveTextContent("Count is 1");
});
