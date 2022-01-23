import { IMatchState } from "../../types";
import { CmdArgs } from "..";
import { decline } from "../decline/decline";

export async function reject(args: CmdArgs): Promise<IMatchState> {
  const { state, stderr } = args;
  if (state && state.resigned) {
    return decline(args);
  }
  if (state && state.doubled) {
    // return drop(args);
    stderr("TODO: not implemented");
    return state;
  }
  stderr("You can only reject if the cube or a resignation has been offered.");
  return state;
}
