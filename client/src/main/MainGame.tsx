import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import { InfoContainer } from "../global-ui/InfoContainer";
import { Player } from "@wilma/types";
import { Right } from "./Right";
import { useGameState } from "./useGameState";
import { Left } from "./Left";
import { Grid } from "../global-ui/Grid";

export function MainGame() {
  const { key } = useParams();

  if (!key) {
    throw new Error("No key");
  }

  const { gameState, handleStart, time, handleSimulateTurn } = useGameState(key);

  if (!gameState?.players) {
    return <div>Loading...</div>;
  }

  if (gameState?.state === "lobby") {
    return (
      <Lobby onStart={handleStart} gameKey={key} players={gameState.players} />
    );
  }

  const playersDone = gameState.gc.grid.reduce((acc, cell) => acc + cell.pendingActions.length, 0);

  return (
    <Box display="grid" gridTemplateColumns="2fr 8fr 2fr" height="90%" alignItems="center" justifyItems="center" padding={4}>
      <Left game={gameState} />
      <Box maxWidth="700px" minWidth="400px" width='100%'>
        <Grid grid={gameState.gc.grid} isMain={true} />
      </Box>
      <Box display="flex" alignItems="center">
        {gameState?.state === "simulating" ? (
          <Box>
            <Button size="large" variant="outlined" onClick={handleStart}>
              Next Turn
            </Button>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" flexDirection="column">

            <Typography variant="h5">Each player should select it's next action</Typography>
            <Box display="flex">
              <Typography variant="h6">{time}s  {playersDone}/{gameState.players.length} players chose </Typography>
            </Box>

            <Button variant="outlined" onClick={handleSimulateTurn}>
              End Turn
            </Button>
          </Box>
        )}
      </Box>
    </Box >
  );
}

export const Lobby = ({
  gameKey,
  onStart,
  players,
}: {
  gameKey: string;
  onStart: () => void;
  players: Player[];
}) => (
  <Box display="flex" justifyContent="space-around">
    <Box
      flexDirection="column"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <InfoContainer>
        <Typography variant="h2" component="h2">
          Join the game using <strong>{gameKey}</strong> At

        </Typography>
        <Typography variant="h5" component="h2">
          {window.location.origin}/join
        </Typography>
        <Typography variant="h4">
          {players.map((p) => p.Nickname).join(", ")}
        </Typography>
        <Box marginTop={2}>
          <Button variant="outlined" onClick={onStart} >
            Start
          </Button>
        </Box>
      </InfoContainer>
    </Box>
  </Box>
);
