import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from "@mui/material/Box";
import { Container, Typography } from '@mui/material';
import { InfoContainer } from '../global-ui/InfoContainer';
import { fetchGame } from '../serverClient';

export function MainGame() {
    const { id } = useParams();
    const playerId = localStorage.getItem('playerId')

    useEffect(() => {
        (async () => {
            await fetchGame('id')
        })()

    }, [])
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
            </Box>
        </Container>
    );
}
