import { CmdArgs, CmdProto } from ".";
import { newGame } from "./newgame/newgame";
import { move } from "./move/move";
import { play } from "./play/play";
import { roll } from "./roll/roll";
import { hint } from "./hint/hint";
import { IMatchState } from "../types";

type CommandTable = {
  [name: string]: { def: CmdDef; desc: string };
};

type CmdDef = CmdProto | CommandTable | string;

const table: CommandTable = {
  new: {
    def: {
      game: { def: newGame, desc: "Start a new game" },
    },
    desc: "Start a new game or match",
  },
  move: { def: move, desc: "Make a backgammon move" },
  play: { def: play, desc: "Tell the computer to move" },
  // decline,
  // redouble,
  // reject: { def: reject, desc: "Reject a cube or resignation" },
  // resign: { def: resign, desc: "Offer to end the current game" },
  roll: { def: roll, desc: "Roll the dice" },
  // take,
  hint: { def: hint, desc: "Give hint on best moves" },
  help: { def: help, desc: "Describe commands" },
};

export type { CmdProto };

export const commands: {
  name: string;
  fn: CmdProto;
}[] = Object.getOwnPropertyNames(table).map((name) => ({
  name,
  fn: getCmdFn(table, name),
}));

function getCmdFn(table: CommandTable, name: string): CmdProto {
  if (isString(table[name].def)) {
    return aliasCmd(table[name].def as string);
  }
  if (isCommandTable(table[name].def)) {
    return subCmd(table[name].def as CommandTable);
  }
  return table[name].def as CmdProto;
}

function isString(def: CmdDef): def is string {
  return typeof def === "string";
}

function isCommandTable(def: CmdDef): def is CommandTable {
  return !(def instanceof Function || typeof def === "string");
}

function aliasCmd(alias: string): CmdProto {
  let [name, ...argv] = alias.split(" ");
  return async function (args: CmdArgs): Promise<IMatchState> {
    let fn = getCmdFn(table, name);
    return await fn({ ...args, argv });
  };
}

function subCmd(sub: CommandTable): CmdProto {
  return async function (args: CmdArgs): Promise<IMatchState> {
    const { argv, state, stderr } = args;
    if (!argv[0]) {
      stderr(`incomplete command`);
      return state;
    }
    let fn = getCmdFn(sub, argv[0]);
    if (!fn) {
      stderr(`invalid sub command '${argv[0]}'`);
      return state;
    }
    return await fn(args);
  };
}

async function help(args: CmdArgs): Promise<IMatchState> {
  const { argv, state, stdout } = args;
  let output: string[] = [];
  const tablewidth = 43,
    cmdlen = 10,
    desclen = tablewidth - cmdlen - 7;

  function cmdHelp(cmd: string) {
    if (isCommandTable(table[cmd].def)) {
      // has nested commands
      let subTable: CommandTable = table[cmd].def as CommandTable;
      for (let sub of Object.getOwnPropertyNames(subTable)) {
        output.push(
          ` | ${(cmd + " " + sub).padEnd(cmdlen)} | ${(subTable[sub].desc || "")
            .substring(0, desclen)
            .padEnd(desclen)} |`
        );
      }
    } else {
      output.push(
        ` | ${cmd.padEnd(cmdlen)} | ${(table[cmd].desc || "")
          .substring(0, desclen)
          .padEnd(desclen)} |`
      );
    }
  }

  output.push(` ${"-".repeat(tablewidth)}`);
  output.push(
    ` | ${"Command".padEnd(cmdlen)} | ${"Description".padEnd(desclen)} |`
  );
  output.push(` ${"-".repeat(tablewidth)}`);
  if (argv[0]) {
    cmdHelp(argv[0]);
  } else {
    // print all commands
    for (let name of Object.getOwnPropertyNames(table)) {
      cmdHelp(name);
    }
    output.push(
      ` | ${"clear".padEnd(cmdlen)} | ${"Clear the screen".padEnd(desclen)} |`
    );
  }
  output.push(` ${"-".repeat(tablewidth)}`);
  stdout(output.join("\n"));
  return state;
}
