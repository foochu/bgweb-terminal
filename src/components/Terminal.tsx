import { useEffect, useRef } from "react";
import styled from "styled-components";
import { TextInput } from "./TextInput";

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

const Row = styled.div`
  display: flex;
  gap: 8px;
`;

const Col = styled.div<{
  grow?: boolean;
}>`
  ${(props) => (props.grow ? "flex-grow: 1;" : "")}
`;

const Prompt = styled.span`
  color: rgb(0, 143, 17);
`;

const Ascii = styled.pre`
  margin: 8px 0;
`;

type Props = {
  prompt: string;
  lines: string[];
  input: string;
  onInput: (value: string) => void;
  onSubmit: (e: { line: string; argv: string[] }) => Promise<void>;
  suggestions: string[];
};

export function Terminal({
  prompt,
  lines,
  input,
  onInput,
  onSubmit,
  suggestions,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && inputRef.current.scrollIntoView) {
      inputRef.current.scrollIntoView(false);
    }
  }, [prompt, lines.length]);

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
          onInput("");
        }}
      >
        <Row>
          <Col>
            <Prompt>{prompt}</Prompt>
          </Col>
          <Col grow>
            <TextInput
              value={input}
              onChange={(value) => onInput(value)}
              suggestions={suggestions}
              inputRef={inputRef}
            />
          </Col>
        </Row>
      </form>
    </Editor>
  );
}
