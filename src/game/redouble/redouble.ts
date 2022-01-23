import { IMatchState } from "../../types";
import { CmdArgs } from "..";

export async function redouble(args: CmdArgs): Promise<IMatchState> {
  const { state, stderr } = args;
  stderr("TODO: not implemented");
  return state;
}
