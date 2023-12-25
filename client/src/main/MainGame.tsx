import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from "@mui/material/Box";
import { Container, Typography } from '@mui/material';
import { InfoContainer } from '../global-ui/InfoContainer';
import { fetchGame } from '../serverClient';
import { Game } from '../../../types';
import { Board } from './Board';

export function MainGame() {
    const [game, setGame] = useState<Game>();

    const { id } = useParams();
    const playerId = localStorage.getItem('playerId')

    if (!id) {
        throw new Error('No id')
    }

    useEffect(() => {
        const init = async () => {
            setGame(await fetchGame(id))
        }

        init()
    }, [id])
    return (
        <Container>
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
                Player id: {playerId}
                {game && <Board game={game} />}
            </Box>
        </Container>
    );
}
