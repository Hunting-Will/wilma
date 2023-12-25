import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from "@mui/material/Box";

export function Game() {
    const { id } = useParams();
    const playerId = localStorage.getItem('playerId')

    return (

        <Box
            flexDirection="column"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            Game {id}, Player {playerId}
        </Box>
    );
}
