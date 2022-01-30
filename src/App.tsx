import styled from "styled-components";
import { GameState, IMatchState, IPlayer, PlayerType } from "./types";
import { getCommands } from "./Cmd";
import { useState } from "react";
import { Terminal } from "./Terminal";

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
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");

  return (
    <Container>
      <Terminal
        prompt={state.gameState === GameState.None ? "(no game)" : ">"}
        lines={[
          "Backgammon Web Terminal",
          "Copyright (C) 2022 Rami Keränen",
          "Based on GNU Backgammon under GPL license",
          " ",
          ...lines,
        ]}
        input={input}
        onInput={(val) => setInput(val)}
        onSubmit={async ({ line, argv }) => {
          let commands = getCommands(state, setState);
          const [command, ...rest] = argv;
          if (command === "clear") {
            setLines([]);
          } else if (commands[command]) {
            const args = rest.join(" ");
            const output = await commands[command](args);
            setLines([...lines, line, ...output, " "]);
          } else {
            setLines([...lines, line, "invalid command", " "]);
          }
        }}
      />
    </Container>
  );
}

export default App;
