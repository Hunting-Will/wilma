import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import Box from "@mui/material/Box";
import type { Causes, GameAction } from '@wilma/types/';
import { useGameState } from '../main/useGameState';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { Grid } from '../global-ui/Grid';
import { setAction } from '../serverClient';
import { Lobby } from './Lobby';
import { actions } from '../global-ui';


const Item = styled('div')<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    margin: 2,
    borderRadius: 5,
    border: `2px solid ${isSelected ? '#c0e1c0' : '#a2a2d8'}`,
    cursor: 'pointer'
}));


const causes: Record<Causes, string> = {
    "harvest-poisoned": "harversed a poisoned tile",
    "harvested": "harvesting a tile :>", "seeded": 'planting a seed', "poisoned-failed": 'failed poisoning :<', "none": 'missed your turn :<', 'mouse': 'Mouse'
}
export function SubGame() {
    const { key } = useParams();
    const playerId = localStorage.getItem("playerId");

    if (!key || !playerId) {
        throw new Error("No key or playerId");
    }

    const { gameState, turnResults } = useGameState(key)
    const [selectedAction, setSelectedAction] = useState<GameAction>()
    const [cellID, setCellID] = useState('')



    const player = useMemo(() =>
        gameState?.players.find(({ ID }) => ID === playerId)
        , [playerId, gameState])

    const init = useCallback(() => {
        setCellID('')
        setSelectedAction(undefined)
    }, [])

    useEffect(() => {
        if (gameState?.state === 'simulating') {
            init()
        }
    }, [init, gameState])

    const handleSetGrid = (id: string) => {
        if (!selectedAction || !playerId) {
            return
        }

        setAction(key, playerId, selectedAction, id)
        setCellID(id)
    }
    if (gameState?.state === 'lobby') {
        return <Lobby />
    }
    if (gameState?.state === 'simulating') {
        const results = turnResults?.results[playerId]

        return <Box>
            <Typography textAlign="center" variant="h3">
                Turn concluded
            </Typography>
            <List>
                {results && results.map(result => <ListItem><ListItemText primary={`You got ${result.scoreChange} points
                    for ${causes[result.cause] || "you did nothing"}`}>
                </ListItemText></ListItem>
                )}
            </List>
        </Box >
    }

    return (
        <Box
            display="grid"
            gridTemplateRows="auto 1fr auto"
            alignItems="center"
            height="100%"
            width="100%"
            maxWidth="500px"
            padding={1}

        >
            <Box>
                <Typography variant="h3"> {player?.Nickname}, {player?.Score}</Typography>
            </Box>
            <Grid grid={gameState?.gc.grid} onSet={handleSetGrid} cellID={cellID} selectedAction={selectedAction} isMain={false}></Grid>
            <Box display="grid" width="100%" gridTemplateColumns={`repeat(${actions.length}, 1fr)`}>
                {actions.map(({ action, img }) =>
                    <Box display="flex" flexDirection="column" key={action}>
                        <Item
                            isSelected={selectedAction === action}
                            onClick={() => setSelectedAction(action)}>
                            <img src={img} alt={action}></img>
                        </Item>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
