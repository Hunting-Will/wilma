import React, { useState } from 'react';

import Typography from "@mui/material/Typography";
import { InfoContainer } from "../global-ui/InfoContainer";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { createGame } from '../serverClient';
import { useNavigate } from 'react-router-dom';

export function Create() {
    const navigate = useNavigate();
    const [name, setName] = useState('')

    const handleCreate = async () => {
        const { gameId } = await createGame(name)
        localStorage.setItem('gameId', gameId);

        navigate(`/main/${gameId}`)
    }
    return (
        <InfoContainer>
            <Typography variant="h3">Create a game of Hunting Will</Typography>
            <Box
                flexDirection="column"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <TextField id="Name" label="Name" sx={{ m: 1 }} variant="standard" value={name} onChange={(e) => setName(e.target.value)} />

                <Button disabled={!name} variant="contained" onClick={handleCreate} sx={{ m: 2 }}>Create!</Button>
            </Box>
        </InfoContainer >
    );
}
