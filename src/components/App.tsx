import styled from "styled-components";
import { GameState, IMatchState, IMove, IPlayer, PlayerType } from "../types";
import { useEffect, useState } from "react";
import { Terminal } from "./Terminal";
import { CmdProto, commands } from "../game/command";
import { getCurrentSide } from "../game";
import { formatMove } from "../game/formatMove";
import { useQuery, UseQueryResult } from "react-query";
import { positionIdFromBoard } from "../game/positionid";
import { getAllMoves } from "../api";

const title = `Backgammon Web Terminal
Copyright (C) 2022 Rami Keränen
Based on GNU Backgammon under GPL license`;

const Container = styled.div`
  height: 100vh;
`;

function initState(): IMatchState {
  let x: IPlayer = {
    name: "player",
    type: PlayerType.Human,
  };
  let o: IPlayer = {
    name: "cpu",
    type: PlayerType.Computer,
  };

  return {
    players: { x, o },
    board: { x: {}, o: {} },
    gameState: GameState.None,
    points: { x: 0, o: 0 },
    inTurn: x,
    onRoll: x,
  };
}

function App() {
  const [state, setState] = useState(initState());
  const [lines, setLines] = useState<string[]>([title]);
  const [input, setInput] = useState("");

  let commands = getCommands(state, setState);

  useEffect(() => {
    (async function () {
      let help = await commands["help"]("");
      setLines([...lines, ...help]);
    })();
  }, []);
 
  useEffect(() => {
    const maxLines = 150;
    if (lines.length > maxLines) {
      setLines(lines.slice(Math.floor(maxLines / 3)));
    }
  }, [lines]);

  const stateId = `${positionIdFromBoard(state.board)}/[${(
    state.dice || []
  ).join(",")}]`;

  const movesQuery = useQuery(
    `/moves/${stateId}`,
    () => getAllMoves(state.board, getCurrentSide(state), state.dice || []),
    {
      enabled: !!state.dice,
    }
  );

  return (
    <Container>
      <Terminal
        prompt={state.gameState === GameState.None ? "(no game)" : ">"}
        lines={lines}
        input={input}
        onInput={(val) => setInput(val)}
        onSubmit={async ({ line, argv }) => {
          const [command, ...rest] = argv;
          if (command === "clear") {
            setLines([]);
          } else if (commands[command]) {
            const args = rest.join(" ");
            const output = await commands[command](args);
            setLines([...lines, line, ...output]);
          } else {
            setLines([...lines, line, "invalid command"]);
          }
        }}
        suggestions={getSuggestions(state, movesQuery)}
      />
    </Container>
  );
}

function getCommands(
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

function getSuggestions(
  state: IMatchState,
  movesQuery: UseQueryResult<IMove[], unknown>
): string[] {
  let suggestions: string[] = [];
  if (state.gameState !== GameState.Playing) {
    // no game in progress
    suggestions.push("new game");
  } else {
    if (state.inTurn.type === PlayerType.Human) {
      // player's turn
      if (state.dice) {
        if (movesQuery.isLoading) {
          suggestions.push(`move (loading...)`);
        } else if (movesQuery.error) {
          suggestions.push(`move (${movesQuery.error})`);
        } else {
          for (let move of movesQuery.data || []) {
            suggestions.push("move");
            suggestions.push(`move ${formatMove(move, state.board.o)}`);
          }
        }
        suggestions.push("hint");
      } else {
        suggestions.push("roll");
      }
      suggestions.push("new game");
    } else {
      // computer's turn
      suggestions.push("play");
      suggestions.push("new game");
    }
  }

  // always add help
  suggestions.push("help");
  return suggestions;
}

export default App;
