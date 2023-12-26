import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from "@mui/material/Box";
import { Button, Container, Typography } from '@mui/material';
import { InfoContainer } from '../global-ui/InfoContainer';
import { fetchGame } from '../serverClient';
import { Game, Player } from '../../../types';
import { Board } from './Board';
import { Left } from './Left';
import { Right } from './Right';
import { useGameState } from './useGameState';
import { subscribe } from '../liveServerClient';
import { RealtimeGameState } from '../../../types/realtime-types';


export function MainGame() {
    const [players, setPlayers] = useState<Player[]>();
    const { gameState, handleStart } = useGameState()

    const { key } = useParams();

    if (!key) {
        throw new Error('No key')
    }

    const handleData = (data: RealtimeGameState) => {
        setPlayers(data.game.players);

    }
    useEffect(() => {
        const init = async () => {
            const game = await fetchGame(key)
            setPlayers(game.players)
            subscribe(key, handleData)
        }

        init()
    }, [key])



    if (!players) {
        return <div>Loading</div>
    }

    if (gameState === 'waiting') {
        return <Waiting onStart={handleStart} gameKey={key} players={players} />
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

                </InfoContainer>
                <Board />
            </Box>
            <Right players={players} />
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


export const FTUE = () =>
    <Box
        flexDirection="column"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
    >
        <InfoContainer sx={{ width: 400 }}>
            <Typography variant="h3" component="h2">
                Welcome to this game.
                You have 10 sec to decide what to do in each turn.
                You can sow a tile, reap it or plant poison
            </Typography>
        </InfoContainer>
    </Box >
