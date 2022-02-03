import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { TextInput } from "./TextInput";

describe("TextInput", () => {
  it("renders text input", () => {
    render(<TextInput value="foo" onChange={jest.fn()} />);
    expect(screen.getByDisplayValue(/foo/i)).toBeInTheDocument();
  });

  it("suggests value", () => {
    let onChange = jest.fn();
    render(
      <TextInput
        value="foo"
        onChange={onChange}
        suggestions={["foo", "bar", "foobar"]}
      />
    );
    expect(screen.getByTestId(/type-ahead/i)).toHaveTextContent("foobar");

    act(() => {
      fireEvent.keyDown(screen.getByTestId(/input/i), {
        key: "Enter",
      });
    });

    expect(onChange).toHaveBeenCalledWith("foobar");
  });

  it("moves to next suggestion", () => {
    let onChange = jest.fn();
    render(
      <TextInput
        value="foo"
        onChange={onChange}
        suggestions={["foo1", "foo2", "foo3"]}
      />
    );
    expect(screen.getByTestId(/type-ahead/i)).toHaveTextContent("foo1");

    act(() => {
      fireEvent.keyDown(screen.getByTestId(/input/i), {
        key: "ArrowDown",
      });
    });

    expect(screen.getByTestId(/type-ahead/i)).toHaveTextContent("foo2");
  });

  it("moves to previous suggestion", () => {
    let onChange = jest.fn();
    render(
      <TextInput
        value="foo"
        onChange={onChange}
        suggestions={["foo1", "foo2", "foo3"]}
      />
    );
    expect(screen.getByTestId(/type-ahead/i)).toHaveTextContent("foo1");

    act(() => {
      fireEvent.keyDown(screen.getByTestId(/input/i), {
        key: "ArrowUp",
      });
    });

    expect(screen.getByTestId(/type-ahead/i)).toHaveTextContent("foo3");
  });

  it("moves to next letter on space", () => {
    let onChange = jest.fn();
    render(
      <TextInput
        value="foo"
        onChange={onChange}
        suggestions={["foo", "bar", "foobar"]}
      />
    );
    expect(screen.getByTestId(/type-ahead/i)).toHaveTextContent("foobar");

    act(() => {
      fireEvent.keyDown(screen.getByTestId(/input/i), {
        key: " ",
      });
    });

    expect(onChange).toHaveBeenCalledWith("foob");
  });
});
