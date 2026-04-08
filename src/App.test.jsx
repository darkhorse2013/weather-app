import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("App", () => {
  it("renders the app heading and initial empty state", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /daily weather app/i }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/type in a city/i)).toBeInTheDocument();
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

    expect(screen.getByText("Today", { selector: ".today-card-date" })).toHaveClass(
      "today-card-date",
    );
    expect(screen.getByText("Tomorrow", { selector: ".forecast-card-date" })).toHaveClass(
      "forecast-card-date",
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

    expect(screen.getByText(weekdayLabel, { selector: ".forecast-card-date" })).toHaveClass(
      "forecast-card-date",
    );
  });

  it("shows a featured today card above the remaining forecast cards", async () => {
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

    const nextDayLabel = nextDay.toLocaleDateString("en-GB", {
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

    expect(screen.getByText(/featured forecast/i)).toBeInTheDocument();
    expect(
      screen.getByText("Today", { selector: ".today-card-date" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/high 18/i)).toBeInTheDocument();
    expect(
      screen.getByText("Tomorrow", { selector: ".forecast-card-date" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(nextDayLabel, { selector: ".forecast-card-date" }),
    ).toBeInTheDocument();
  });

  it("applies a sunny theme when today's forecast is clear", async () => {
    const user = userEvent.setup();
    const today = new Date();

    const formatDate = (value) => {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: async () => ({
          results: [{ name: "Lisbon", latitude: 38.7223, longitude: -9.1393 }],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          daily: {
            time: [formatDate(today)],
            weathercode: [0],
            temperature_2m_max: [22],
            temperature_2m_min: [14],
          },
        }),
      });

    render(<App />);

    await user.type(screen.getByRole("textbox"), "Lisbon");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByRole("heading", { name: /daily weather app/i }).closest(
      ".app-shell",
    )).toHaveClass("theme-sunny");
  });

  it("applies a rain theme when today's forecast is rainy", async () => {
    const user = userEvent.setup();
    const today = new Date();

    const formatDate = (value) => {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: async () => ({
          results: [{ name: "Cardiff", latitude: 51.4816, longitude: -3.1791 }],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          daily: {
            time: [formatDate(today)],
            weathercode: [61],
            temperature_2m_max: [13],
            temperature_2m_min: [8],
          },
        }),
      });

    render(<App />);

    await user.type(screen.getByRole("textbox"), "Cardiff");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByRole("heading", { name: /daily weather app/i }).closest(
      ".app-shell",
    )).toHaveClass("theme-rain");
  });

  it("saves a searched city for quick reuse", async () => {
    const user = userEvent.setup();
    const today = new Date();

    const formatDate = (value) => {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: async () => ({
          results: [{ name: "Tokyo", latitude: 35.6762, longitude: 139.6503 }],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          daily: {
            time: [formatDate(today)],
            weathercode: [0],
            temperature_2m_max: [24],
            temperature_2m_min: [17],
          },
        }),
      });

    render(<App />);

    await user.type(screen.getByRole("textbox"), "Tokyo");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByRole("button", { name: "Tokyo" })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("weather-app.saved-cities"))).toEqual([
      "Tokyo",
    ]);
  });

  it("searches again when a saved city chip is clicked", async () => {
    const user = userEvent.setup();
    const today = new Date();

    const formatDate = (value) => {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    window.localStorage.setItem(
      "weather-app.saved-cities",
      JSON.stringify(["Berlin"]),
    );

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: async () => ({
          results: [
            {
              name: "Berlin",
              country: "Germany",
              country_code: "DE",
              latitude: 52.52,
              longitude: 13.405,
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          daily: {
            time: [formatDate(today)],
            weathercode: [3],
            temperature_2m_max: [15],
            temperature_2m_min: [8],
          },
        }),
      });

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Berlin" }));

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(screen.getByText(/weather for berlin, de/i)).toBeInTheDocument();
  });

  it("clears the search input after a successful search", async () => {
    const user = userEvent.setup();
    const today = new Date();

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
            time: [formatDate(today)],
            weathercode: [0],
            temperature_2m_max: [18],
            temperature_2m_min: [11],
          },
        }),
      });

    render(<App />);

    await user.type(screen.getByRole("textbox"), "London");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.getByPlaceholderText(/type in a city/i)).toBeInTheDocument();
  });

  it("removes a saved city when its remove button is clicked", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(
      "weather-app.saved-cities",
      JSON.stringify(["Berlin", "York"]),
    );

    render(<App />);

    await user.click(screen.getByRole("button", { name: /remove berlin/i }));

    expect(
      screen.queryByRole("button", { name: "Berlin" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "York" })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("weather-app.saved-cities"))).toEqual([
      "York",
    ]);
  });

  it("shows an umbrella summary for rainy weather", async () => {
    const user = userEvent.setup();
    const today = new Date();

    const formatDate = (value) => {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: async () => ({
          results: [{ name: "Manchester", latitude: 53.4808, longitude: -2.2426 }],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          daily: {
            time: [formatDate(today)],
            weathercode: [61],
            temperature_2m_max: [14],
            temperature_2m_min: [9],
          },
        }),
      });

    render(<App />);

    await user.type(screen.getByRole("textbox"), "Manchester");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(
      screen.getByText(/take an umbrella, there is a good chance you will need it\./i),
    ).toBeInTheDocument();
  });

  it("shows an outdoor summary for bright warm weather", async () => {
    const user = userEvent.setup();
    const today = new Date();

    const formatDate = (value) => {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: async () => ({
          results: [{ name: "Seville", latitude: 37.3891, longitude: -5.9845 }],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          daily: {
            time: [formatDate(today)],
            weathercode: [0],
            temperature_2m_max: [27],
            temperature_2m_min: [16],
          },
        }),
      });

    render(<App />);

    await user.type(screen.getByRole("textbox"), "Seville");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(
      screen.getByText(/a bright, warm day is ahead, perfect for getting outside\./i),
    ).toBeInTheDocument();
  });

  it("renders a weekly temperature trend chart for multi-day forecasts", async () => {
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

    const nextDayLabel = nextDay.toLocaleDateString("en-GB", {
      weekday: "long",
    });

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: async () => ({
          results: [{ name: "Oslo", latitude: 59.9139, longitude: 10.7522 }],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          daily: {
            time: [formatDate(today), formatDate(tomorrow), formatDate(nextDay)],
            weathercode: [0, 3, 61],
            temperature_2m_max: [12, 14, 10],
            temperature_2m_min: [4, 6, 3],
          },
        }),
      });

    render(<App />);

    await user.type(screen.getByRole("textbox"), "Oslo");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(
      screen.getByRole("img", { name: /weekly temperature trend chart/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/weekly temperature trend/i)).toBeInTheDocument();
    expect(screen.getByText("Today", { selector: ".trend-label" })).toBeInTheDocument();
    expect(
      screen.getByText("Tomorrow", { selector: ".trend-label" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(nextDayLabel, { selector: ".trend-label" }),
    ).toBeInTheDocument();
  });

  it("shows town and country in the weather title", async () => {
    const user = userEvent.setup();
    const today = new Date();

    const formatDate = (value) => {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        json: async () => ({
          results: [
            {
              name: "York",
              country: "United Kingdom",
              country_code: "GB",
              latitude: 53.959,
              longitude: -1.0815,
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          daily: {
            time: [formatDate(today)],
            weathercode: [3],
            temperature_2m_max: [13],
            temperature_2m_min: [6],
          },
        }),
      });

    render(<App />);

    await user.type(screen.getByRole("textbox"), "York");
    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(
      screen.getByText(/weather for york, uk/i),
    ).toBeInTheDocument();
  });
});
