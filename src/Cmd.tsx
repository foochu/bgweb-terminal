import { IMatchState } from "./types";
import { CmdProto, commands } from "./game/command";
import { showBoard } from "./game";

export function getCommands(
  state: IMatchState,
  setState: (state: IMatchState) => void
) {
  const ret: {
    [name: string]: (argv: string) => Promise<string[]>;
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
): Promise<string[]> {
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
      return [e.stack || e.message];
    } else {
      return [e as string];
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  return output;
}
