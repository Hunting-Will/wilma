import React, { useState } from 'react';

import Typography from "@mui/material/Typography";
import { InfoContainer } from "../global-ui/InfoContainer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { createGame } from '../serverClient';
import { useNavigate } from 'react-router-dom';

export function Create() {
    const navigate = useNavigate();

    const handleCreate = async () => {
        const { gameId } = await createGame()
        localStorage.setItem('gameId', gameId);

        navigate(`/main/${gameId}`)
    }
    return (
        <InfoContainer>
            <Typography variant="h4">Welcome to Hunting Will</Typography>
            <Typography variant="h5">Press create to start a game</Typography>
            <Box
                flexDirection="column"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Button variant="outlined" onClick={handleCreate} sx={{ m: 2 }}>Create!</Button>
            </Box>
        </InfoContainer >
    );
}
