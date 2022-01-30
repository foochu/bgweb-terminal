import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Editor = styled.div`
  height: 100%;
  color: rgb(0, 255, 65);
  text-align: left;
  overflow-wrap: break-word;
  font-family: "Source Code Pro", monospace;
  font-size: 18px;
  line-height: 22px;
  @media (max-width: 480px) {
    font-size: 14px;
    line-height: 18px;
  }
`;

const Prompt = styled.span`
  color: rgb(0, 143, 17);
`;

const InputLine = styled.div`
  display: inline;
  position: relative;
  top: -1px;
  margin-left: 8px;
`;

const Input = styled.input`
  border: none;
  background-color: inherit;
  outline: none;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
`;

const Ascii = styled.pre`
  margin: 0;
`;

type Props = {
  prompt: string;
  lines: string[];
  input: string;
  onInput: (value: string) => void;
  onSubmit: (e: { line: string; argv: string[] }) => Promise<void>;
};

export function Terminal({ prompt, lines, input, onInput, onSubmit }: Props) {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && inputRef.current.scrollIntoView) {
      inputRef.current.scrollIntoView(false);
    }
  }, [prompt, lines.length]);

  useEffect(() => {
    const c = inputRef.current;
    if (c) {
      c.selectionStart = c.selectionEnd = c.value.length;
    }
  }, [historyIndex]);

  return (
    <Editor
      onClick={() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      {lines.map((line, i) => (
        <Ascii key={i}>{line}</Ascii>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const line = `${prompt} ${input}`;
          const argv = input.trim().split(" ");
          await onSubmit({ line, argv });
          setHistory([...history, input]);
          setHistoryIndex(history.length + 1);
          onInput("");
        }}
      >
        <>
          <Prompt>{prompt}</Prompt>
          <InputLine>
            <Input
              autoFocus
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              value={input}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  let index = Math.max(historyIndex - 1, 0);
                  setHistoryIndex(index);
                  onInput(history[index] || input);
                } else if (e.key === "ArrowDown") {
                  let index = Math.min(historyIndex + 1, history.length - 1);
                  setHistoryIndex(index);
                  onInput(history[index] || input);
                }
              }}
              onChange={(e) => {
                onInput(e.target.value);
              }}
              ref={inputRef}
            />
          </InputLine>
        </>
      </form>
    </Editor>
  );
}
