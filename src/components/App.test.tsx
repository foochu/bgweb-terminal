import { render, screen } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "react-query";
import App from "./App";

jest.mock("register-service-worker", () => ({ register: jest.fn() }));

describe("App", () => {
  it("renders app", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>
    );
    const el = screen.getByText(/Backgammon Web Terminal/i);
    expect(el).toBeInTheDocument();
  });
});
