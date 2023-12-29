import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import Box from "@mui/material/Box";
import type { GameAction } from '../../../types/';
import { useGameState } from '../main/useGameState';
import { Typography } from '@mui/material';
import { Grid } from '../global-ui/Grid';
import { setAction } from '../serverClient';
import { Lobby } from './Lobby';

const Item = styled('div')<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    height: 100,
    width: 100,
    margin: 20,
    padding: 10,
    border: `1px solid ${isSelected ? 'lightgreen' : 'lightgray'}`,
    cursor: 'pointer'
}));


const actions: GameAction[] = ['Seed', 'Harvest', 'Poison'] as unknown as GameAction[]

export function SubGame() {
    const { key } = useParams();

    if (!key) {
        throw new Error("No key");
    }

    const { gameState } = useGameState(key)
    const [selectedAction, setSelectedAction] = useState<GameAction>()
    const [cellID, setCellID] = useState('')

    const playerId = localStorage.getItem("playerId");

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
        return <Box>
            <Typography variant="h2" component="h2">
                Watch main screen for results
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
                    Game {key}, Player {JSON.stringify(player)}
                </Box>
                <Grid grid={gameState?.gc.grid} onSet={handleSetGrid} cellID={cellID} value={selectedAction}></Grid>
                <Box display="flex" justifyContent="center">
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
        </Box>
    );
}
