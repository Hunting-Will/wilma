import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import { InfoContainer } from "../global-ui/InfoContainer";
import { Player } from "../../../types";
import { Board } from "./Board";
import { Right } from "./Right";
import { useGameState } from "./useGameState";
import { Left } from "./Left";

export function MainGame() {
  const { key } = useParams();

  if (!key) {
    throw new Error("No key");
  }

  const { gameState, handleStart, time } = useGameState(key);

  if (!gameState?.players) {
    return <div>Loading...</div>;
  }

  if (gameState?.state === "lobby") {
    return (
      <Lobby onStart={handleStart} gameKey={key} players={gameState.players} />
    );
  }

  return (
    <Box display="flex" style={{height: "100vh"}} justifyContent="space-around">
      <Left game={gameState} />
      <Box
        flexDirection="column"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {gameState?.state === "simulating" ? (
          <InfoContainer>
            <Typography>Yay animations and shit</Typography>
            <Button variant="outlined" onClick={handleStart}>
              Next Turn
            </Button>
          </InfoContainer>
        ) : (
          <InfoContainer>
            <Typography variant="h5">Choose your action!</Typography>
            <Typography variant="h5">{time}</Typography>
          </InfoContainer>
        )}
        <Board />
      </Box>
      <Right players={gameState.players} />
    </Box>
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
          Join the game using {gameKey}
        </Typography>
        <Typography variant="h4">
          {players.map((p) => p.Nickname).join(", ")}
        </Typography>
        <Button variant="outlined" onClick={onStart}>
          Start
        </Button>
      </InfoContainer>
    </Box>
  </Box>
);
