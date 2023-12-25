import React, { useState } from 'react';

import Typography from "@mui/material/Typography";
import { InfoContainer } from "../global-ui/InfoContainer";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { joinGame } from '../serverClient';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('')
  const [gameId, setGameId] = useState('')

  const handleJoin = async () => {
    const { playerId } = await joinGame(gameId, nickname)
    localStorage.setItem('playerId', playerId);
    navigate(`/sub/${gameId}`)
  }
  return (
    <InfoContainer>
      <Typography variant="h3">Hunting Will</Typography>
      <Box
        flexDirection="column"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField id="Nickname" label="Nickname" sx={{ m: 1 }} variant="standard" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <TextField id="GameID" label="Game ID" sx={{ m: 1 }} variant="standard" value={gameId} onChange={(e) => setGameId(e.target.value)} />
        <Button disabled={!nickname || !gameId} variant="contained" onClick={handleJoin} sx={{ m: 2 }}>Join</Button>
      </Box>
    </InfoContainer >
  );
}
