import { render, screen } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "react-query";
import App from "./App";

describe("App", () => {
  it("renders app", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>
    );
    const el = screen.getByText(/Backgammon Web Terminal/i);
    expect(el).toBeInTheDocument();
  });
});
