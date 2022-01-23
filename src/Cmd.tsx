import { IMatchState } from "./types";
import { CmdProto, commands } from "./game/command";
import styled from "styled-components";
import { showBoard } from "./game";

const Ascii = styled.pre`
  margin: 0;
`;

export function getCommands(
  state: IMatchState,
  setState: (state: IMatchState) => void
) {
  const ret: {
    [name: string]: (argv: string) => Promise<JSX.Element | undefined>;
  } = {};

  for (let { name, fn } of commands) {
    ret[name] = (argv: string) => exec(fn, argv, state, setState);
  }

  return ret;
}

async function exec(
  cmd: CmdProto,
  _argv: string,
  state: IMatchState,
  setState: (state: IMatchState) => void
): Promise<JSX.Element | undefined> {
  let output: string[] = [];
  let errors: string[] = [];
  let stdout = (s: string) => output.push(s);
  let stderr = (s: string) => errors.push(s);

  let argv = _argv.split(" ").map((s) => s.toLowerCase());

  try {
    let newState = await cmd({ argv, state, stdout, stderr });
    stdout(" ");
    showBoard(newState, stdout);
    setState(newState);
  } catch (e) {
    if (e instanceof Error) {
      return <Ascii>{e.stack || e.message}</Ascii>;
    } else {
      return <Ascii>{e as string}</Ascii>;
    }
  }

  if (errors.length > 0) {
    return (
      <>
        {errors.map((s, i) => (
          <Ascii key={i}>{s}</Ascii>
        ))}
      </>
    );
  }

  if (output.length > 0) {
    return (
      <>
        {output.map((s, i) => (
          <Ascii key={i}>{s}</Ascii>
        ))}
      </>
    );
  }

  return undefined;
}
