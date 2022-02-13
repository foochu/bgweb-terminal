import { CmdArgs, CmdProto } from ".";
import { newGame } from "./newgame/newgame";
import { move } from "./move/move";
import { play } from "./play/play";
import { roll } from "./roll/roll";
import { hint } from "./hint/hint";
import { IMatchState } from "../types";

type CommandTable = {
  [name: string]: { def: CmdDef };
};

type CmdDef = CmdProto | CommandTable | string;

const table: CommandTable = {
  new: {
    def: {
      game: { def: newGame },
    },
  },
  move: { def: move },
  play: { def: play },
  // decline,
  // redouble,
  // reject: { def: reject },
  // resign: { def: resign },
  roll: { def: roll },
  // take,
  hint: { def: hint },
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
