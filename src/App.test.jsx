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

  it("highlights only today's forecast date after a successful search", async () => {
    const user = userEvent.setup();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (value) => {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: async () => ({
          results: [{ name: "London", latitude: 51.5072, longitude: -0.1276 }],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          daily: {
            time: [formatDate(today), formatDate(tomorrow)],
            weathercode: [0, 3],
            temperature_2m_max: [18, 16],
            temperature_2m_min: [11, 9],
          },
        }),
      });

    render(<App />);

    await user.type(screen.getByRole("textbox"), "London");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByText("Date: Today")).toHaveClass("highlightDate");
    expect(screen.getByText("Date: Tomorrow")).toHaveClass(
      "weatherDate",
    );
  });

  it("shows weekday labels for dates after tomorrow", async () => {
    const user = userEvent.setup();
    const today = new Date();
    const tomorrow = new Date(today);
    const nextDay = new Date(today);

    tomorrow.setDate(today.getDate() + 1);
    nextDay.setDate(today.getDate() + 2);

    const formatDate = (value) => {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const weekdayLabel = nextDay.toLocaleDateString("en-GB", {
      weekday: "long",
    });

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: async () => ({
          results: [{ name: "London", latitude: 51.5072, longitude: -0.1276 }],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          daily: {
            time: [formatDate(today), formatDate(tomorrow), formatDate(nextDay)],
            weathercode: [0, 3, 61],
            temperature_2m_max: [18, 16, 15],
            temperature_2m_min: [11, 9, 8],
          },
        }),
      });

    render(<App />);

    await user.type(screen.getByRole("textbox"), "London");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByText(`Date: ${weekdayLabel}`)).toHaveClass(
      "weatherDate",
    );
  });
});
