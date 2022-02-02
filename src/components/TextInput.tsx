import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  border: none;
  background-color: inherit;
  outline: none;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  width: 100%;
  z-index: 1;
`;

const TypeAhead = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  width: 100%;
  height: 100%;
  color: rgba(0, 255, 65, 0.25);
`;

type Props = {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  inputRef?: React.RefObject<HTMLInputElement>;
};

export function TextInput({
  value,
  onChange,
  suggestions = [],
  inputRef,
}: Props) {
  const [autoCompIndex, setAutoCompIndex] = useState(0);

  // safety
  value = value || "";

  useEffect(() => {
    if (!value) {
      setAutoCompIndex(0);
    }
  }, [value]);

  let suggest = suggestions.filter(
    (s) =>
      s.length > value.length &&
      s.toLowerCase().indexOf(value.toLowerCase()) === 0
  );

  return (
    <Wrapper>
      <Input
        data-testid="input"
        autoFocus
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={value}
        onKeyDown={(e) => {
          if (suggest.length > 0) {
            switch (e.key) {
              case "Tab":
              case "Enter":
                // complete word
                e.preventDefault();
                onChange(suggest[autoCompIndex] || "");
                break;
              case "ArrowRight":
              case " ":
                // next letter
                e.preventDefault();
                onChange(
                  value +
                    suggest[autoCompIndex].substring(
                      value.length,
                      value.length + 1
                    ) || ""
                );
                break;
              case "ArrowLeft":
                // previous letter
                e.preventDefault();
                onChange(value.substring(0, value.length - 1) || "");
                break;
              case "ArrowUp":
                // toggle suggestions
                e.preventDefault();
                setAutoCompIndex(
                  autoCompIndex > 0
                    ? (autoCompIndex - 1) % suggest.length
                    : suggest.length - 1
                );
                break;
              case "ArrowDown":
                // toggle suggestions
                e.preventDefault();
                setAutoCompIndex((autoCompIndex + 1) % suggest.length);
                break;
            }
          } else {
            switch (e.key) {
              case "Tab":
                e.preventDefault();
                break;
            }
          }
        }}
        onChange={(e) => onChange(e.target.value)}
        ref={inputRef}
      />
      <TypeAhead data-testid="type-ahead">{suggest[autoCompIndex]}</TypeAhead>
    </Wrapper>
  );
}
