import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import Box from "@mui/material/Box";
import type { Causes, GameAction } from '@wilma/types/';
import { useGameState } from '../main/useGameState';
import { Typography } from '@mui/material';
import { Grid } from '../global-ui/Grid';
import { setAction } from '../serverClient';
import { Lobby } from './Lobby';

const Item = styled('div')<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    margin: 10,
    padding: 30,
    border: `1px solid ${isSelected ? 'lightgreen' : 'lightgray'}`,
    cursor: 'pointer'
}));


const actions: GameAction[] = ['Seed', 'Harvest', 'Poison'] as unknown as GameAction[]


const causes: Record<Causes, string> = {
    "harvest-poisoned": "harversed a poisoned tile",
    "harvested": "harvesting a tile :>", "seeded": 'planting a seed', "poisoned-failed": 'failed poisoning :<', "none": 'missed your turn :<'
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
        const result = turnResults?.results[playerId]
        if (!result) {
            return <Box></Box>
        }
        return <Box>
            <Typography textAlign="center" variant="h3">
                Turn concluded
            </Typography>
            <Typography textAlign="center" variant="h4">
                You got {result.scoreChange} points
                for {causes[result.cause]}
            </Typography>
        </Box>
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="99vh"
            padding="0 15px 0 15px">
            <Box
                flexDirection="column"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                height="90vh"
            >
                <Box>
                    <Typography variant="h3"> {player?.Nickname}, {player?.Score}</Typography>
                </Box>
                <Grid grid={gameState?.gc.grid} onSet={handleSetGrid} cellID={cellID} value={selectedAction}></Grid>
                <Box display="grid" gridTemplateColumns={`repeat(${actions.length}, 1fr)`}>
                    {actions.map((action) =>
                        <Item
                            key={action}
                            isSelected={selectedAction === action}
                            onClick={() => setSelectedAction(action)}>
                            {action}
                        </Item>
                    )}
                </Box>
            </Box>
        </Box >
    );
}
