import { CmdArgs, CmdProto } from ".";
import { newGame } from "./newgame/newgame";
import { move } from "./move/move";
import { play } from "./play/play";
import { roll } from "./roll/roll";
import { hint } from "./hint/hint";
import { IMatchState } from "../types";

type CommandTable = {
  [name: string]: { fn: CmdProto | CommandTable; desc: string };
};

const table: CommandTable = {
  new: {
    fn: {
      game: { fn: newGame, desc: "Start a new game" },
    },
    desc: "Start a new game or match",
  },
  move: { fn: move, desc: "Make a backgammon move" },
  play: { fn: play, desc: "Force the computer to move" },
  // decline,
  // redouble,
  // reject: { fn: reject, desc: "Reject a cube or resignation" },
  // resign: { fn: resign, desc: "Offer to end the current game" },
  roll: { fn: roll, desc: "Roll the dice" },
  // take,
  hint: { fn: hint, desc: "Give hint on best moves" },
  help: { fn: help, desc: "Describe commands" },
};

export type { CmdProto };

export const commands: {
  name: string;
  fn: CmdProto;
}[] = Object.getOwnPropertyNames(table).map((name) => ({
  name,
  fn: isCommandTable(table[name].fn)
    ? subCmd(table[name].fn as CommandTable)
    : (table[name].fn as CmdProto),
}));

function isCommandTable(fn: CmdProto | CommandTable): fn is CommandTable {
  return !(fn instanceof Function);
}

function subCmd(sub: CommandTable): CmdProto {
  return async function (args: CmdArgs): Promise<IMatchState> {
    const { argv, state, stderr } = args;
    if (!argv[0]) {
      stderr(`incomplete command`);
      return state;
    }
    let cmd = sub[argv[0]];
    if (!cmd) {
      stderr(`invalid sub command '${argv[0]}'`);
      return state;
    }
    if (isCommandTable(cmd.fn)) {
      throw new Error("only support 1 level of nested commands");
    }
    return await cmd.fn(args);
  };
}

async function help(args: CmdArgs): Promise<IMatchState> {
  const { argv, state, stderr } = args;
  const tablewidth = 43,
    cmdlen = 10,
    desclen = tablewidth - cmdlen - 7;
  function cmdHelp(cmd: string) {
    if (isCommandTable(table[cmd].fn)) {
      // has nested commands
      let subTable: CommandTable = table[cmd].fn as CommandTable;
      for (let sub of Object.getOwnPropertyNames(subTable)) {
        stderr(
          ` | ${(cmd + " " + sub).padEnd(cmdlen)} | ${(subTable[sub].desc || "")
            .substring(0, desclen)
            .padEnd(desclen)} | `
        );
      }
    } else {
      stderr(
        ` | ${cmd.padEnd(cmdlen)} | ${(table[cmd].desc || "")
          .substring(0, desclen)
          .padEnd(desclen)} | `
      );
    }
  }
  stderr(` ${"-".repeat(tablewidth)}`);
  stderr(` | ${"Command".padEnd(cmdlen)} | ${"Description".padEnd(desclen)} |`);
  stderr(` ${"-".repeat(tablewidth)}`);
  if (argv[0]) {
    cmdHelp(argv[0]);
  } else {
    // print all commands
    for (let name of Object.getOwnPropertyNames(table)) {
      cmdHelp(name);
    }
    stderr(
      ` | ${"clear".padEnd(cmdlen)} | ${"Clear the screen".padEnd(desclen)} |`
    );
  }
  stderr(` ${"-".repeat(tablewidth)}`);
  return state;
}
