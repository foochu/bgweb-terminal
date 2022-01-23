import { TerminalContextProvider, ReactTerminal } from "react-terminal";
import styled from "styled-components";
import { GameState, IMatchState, IPlayer, PlayerType } from "./types";
import { getCommands } from "./Cmd";
import { useState } from "react";

const Container = styled.div`
  height: 100vh;
  background-color: rgb(13, 2, 8);
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

  return (
    <Container>
      <TerminalContextProvider>
        <ReactTerminal
          commands={{ ...getCommands(state, setState) }}
          theme="matrix"
          prompt={state.gameState === GameState.None ? "(no game)" : ">"}
          enableInput={true}
          errorMessage="invalid command"
          showControlBar={false}
          welcomeMessage={
            <>
              <div>Backgammon Web Terminal</div>
              <div>Copyright (C) 2022 Rami Keränen</div>
              <div>
                Based on GNU Backgammon (https://www.gnu.org/software/gnubg)
                under GPL license
              </div>
            </>
          }
        />
      </TerminalContextProvider>
    </Container>
  );
}

export default App;
