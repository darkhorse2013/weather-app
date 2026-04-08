import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("App", () => {
  it("renders the app heading and initial empty state", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /daily weather app/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/no weather data yet/i)).toBeInTheDocument();
  });

  it("shows a validation message when search is clicked with no city entered", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<App />);

    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByText(/please enter a city!/i)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("clears the validation message when the user starts typing", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: /search/i }));
    expect(screen.getByText(/please enter a city!/i)).toBeInTheDocument();

    await user.type(screen.getByRole("textbox"), "London");

    expect(screen.queryByText(/please enter a city!/i)).not.toBeInTheDocument();
  });
});
