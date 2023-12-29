import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import Box from "@mui/material/Box";
import type { GameAction } from '../../../types/';
import { useGameState } from '../main/useGameState';
import { InfoContainer } from '../global-ui/InfoContainer';
import { Typography } from '@mui/material';
import { Grid } from './Grid';

const Item = styled('div')<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    height: 100,
    width: 100,
    margin: 20,
    padding: 10,
    border: `1px solid ${isSelected ? 'lightgreen' : 'lightgray'}`,
    cursor: 'pointer'
}));


const mockActionsArray: GameAction[] = ['Seed', 'Harvest', 'PutMouse'] as unknown as GameAction[]

export function SubGame() {
    const { key } = useParams();

    if (!key) {
        throw new Error("No key");
    }


    const { gameState } = useGameState(key)
    const [actions, setActions] = useState<GameAction[]>(mockActionsArray)
    const [selectedAction, setSelectedAction] = useState<GameAction>()
    const [cellID, setCellID] = useState('')


    const n = Math.sqrt(gameState?.gc.grid.length || 0)

    const playerId = localStorage.getItem("playerId");

    const player = useMemo(() =>
        gameState?.players.find(({ ID }) => ID === playerId)
        , [playerId, gameState])


    const handleSetGrid = (cellId: string) => {
        setCellID(cellID)
    }
    if (gameState?.state === 'waiting') {
        return <Waiting />
    }
    // if (gameState?.state === 'simulating') {
    //     return <div>Watch main screen for results</div>
    // }


    if (!gameState?.gc.grid) {
        return <div></div>
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
                <Grid grid={gameState?.gc.grid} value={cellID} onSet={handleSetGrid} selectecID={cellID}></Grid>
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


export const Waiting = () =>
    <Box display="flex" justifyContent="space-around">
        <Box
            flexDirection="column"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            <InfoContainer>
                <Typography variant="h2" component="h2">
                    Waiting to start game
                </Typography>
            </InfoContainer>
        </Box>
    </Box>