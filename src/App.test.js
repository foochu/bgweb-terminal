import { render, screen } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "react-query";
import App from "./App";

test("renders app", () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <App />
    </QueryClientProvider>
  );
  const linkElement = screen.getByText(/Backgammon Web Terminal/i);
  expect(linkElement).toBeInTheDocument();
});
