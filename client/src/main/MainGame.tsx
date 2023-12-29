import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from "@mui/material/Box";
import { Button, Typography } from '@mui/material';
import { InfoContainer } from '../global-ui/InfoContainer';
import { Player } from '../../../types';
import { Board } from './Board';
// import { Left } from './Left';
import { Right } from './Right';
import { useGameState } from './useGameState';


export function MainGame() {
    const { key } = useParams();

    if (!key) {
        throw new Error('No key')
    }

    const { gameState, handleStart, time } = useGameState(key)

    if (!gameState?.players) {
        return <div>Loading</div>
    }

    if (gameState?.state === 'waiting') {
        return <Waiting onStart={handleStart} gameKey={key} players={gameState.players} />
    }

    if (gameState?.state === 'simulating') {
        return <Simulating onStart={handleStart} gameKey={key} players={gameState.players} />
    }

    return (
        <Box display="flex" justifyContent="space-around">

            {/* {game && <Left game={game} />} */}
            <Box
                flexDirection="column"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <InfoContainer>
                    <Typography variant="h2">{time}</Typography>
                    <Typography variant="h3">Player selecting actions</Typography>

                </InfoContainer>
                <Board />
            </Box>
            <Right players={gameState.players} />
        </Box>
    );
}


export const Waiting = ({ gameKey, onStart, players }: { gameKey: string, onStart: () => void, players: Player[] }) =>
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
                <Typography variant="h4" >
                    {players.map(p => p.Nickname).join(', ')}
                </Typography>
                <Button variant="outlined" onClick={onStart}>Start</Button>
            </InfoContainer>
        </Box>
    </Box>

export const Simulating = ({ gameKey, onStart, players }: { gameKey: string, onStart: () => void, players: Player[] }) =>
    <Box display="flex" justifyContent="space-around">
        <Box
            flexDirection="column"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            <InfoContainer>
                <Typography variant="h2" component="h2">
                    Start Next Turn
                </Typography>
                <Typography variant="h4" >
                    {players.map(p => p.Nickname).join(', ')}
                </Typography>
                <Button variant="outlined" onClick={onStart}>Start</Button>
            </InfoContainer>
        </Box>
    </Box>