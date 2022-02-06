import { render, screen } from "@testing-library/react";
import { Terminal } from "./Terminal";

describe("Terminal", () => {
  it("renders terminal", () => {
    render(
      <Terminal
        title="bgweb"
        input="foo"
        onInput={jest.fn()}
        onSubmit={jest.fn()}
        lines={["Hello world"]}
        prompt="$"
        suggestions={[]}
      />
    );
    const el = screen.getByText(/Hello world/i);
    expect(el).toBeInTheDocument();
  });
});
