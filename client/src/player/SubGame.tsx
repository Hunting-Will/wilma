import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import Box from "@mui/material/Box";
import type { GameAction } from '../../../types/';
import { useGameState } from '../main/useGameState';
import { InfoContainer } from '../global-ui/InfoContainer';
import { Typography } from '@mui/material';
import { Grid } from './Grid';
import { setAction } from '../serverClient';

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

    const playerId = localStorage.getItem("playerId");

    const player = useMemo(() =>
        gameState?.players.find(({ ID }) => ID === playerId)
        , [playerId, gameState])


    if (!gameState?.gc.grid || !playerId || !player) {
        return <div>missing shit</div>
    }

    const handleSetGrid = (id: string) => {
        if (!selectedAction) {
            return
        }

        setAction(key, playerId, selectedAction, cellID)
        setCellID(id)
    }
    if (gameState?.state === 'lobby') {
        return <Lobby />
    }
    if (gameState?.state === 'simulating') {
        return <div>Watch main screen for results</div>
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
                <Grid grid={gameState?.gc.grid} onSet={handleSetGrid} selectecID={cellID} selectedAction={selectedAction}></Grid>
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


export const Lobby = () =>
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