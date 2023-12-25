import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from "@mui/material/Box";
import { Button, Container, Typography } from '@mui/material';
import { InfoContainer } from '../global-ui/InfoContainer';
import { fetchGame } from '../serverClient';
import { Game } from '../../../types';
import { Board } from './Board';
import { Left } from './Left';
import { Right } from './Right';
import { useGameState } from './useGameState';


export function MainGame() {
    const [game, setGame] = useState<Game>();
    const { gameState, handleStart, handleFinishFtue } = useGameState()

    const { id } = useParams();

    if (!id) {
        throw new Error('No id')
    }
    console.log(game)

    useEffect(() => {
        const init = async () => {
            const game = await fetchGame(id)
            setGame(game)
        }

        init()
    }, [id])



    if (!game) {
        return <div>Loading</div>
    }
    if (gameState === 'waiting') {
        return <Waiting onStart={handleStart} game={game} />
    }
    if (gameState === 'ftue') {
        setTimeout(handleFinishFtue, 2000)
        return <FTUE />
    }
    return (
        <Box display="flex" justifyContent="space-around">
            {game && <Left game={game} />}
            <Box
                flexDirection="column"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <InfoContainer>
                    <Typography variant="h2" component="h2">
                        Join the game using {id}
                    </Typography>

                </InfoContainer>
                {game && <Board game={game} />}
            </Box>
            {game && <Right game={game} />}
        </Box>
    );
}


export const Waiting = ({ game, onStart }: { game: Game, onStart: () => void }) =>
    <Box display="flex" justifyContent="space-around">
        <Box
            flexDirection="column"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            <InfoContainer>
                <Typography variant="h2" component="h2">
                    Join the game using {game.key}
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
