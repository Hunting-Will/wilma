import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import Box from "@mui/material/Box";
import { fetchGame } from '../serverClient';
import type { Player, GameAction } from '../../../types/';
import { subscribe } from '../liveServerClient';
import { GameController } from '../../../game-logic/GameController';
import { RealtimeGameState } from '../../../types/realtime-types';
import { useGameState } from '../main/useGameState';
import { InfoContainer } from '../global-ui/InfoContainer';
import { Typography } from '@mui/material';

const Item = styled('div')<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    height: 100,
    width: 100,
    margin: 20,
    padding: 10,
    border: `1px solid ${isSelected ? 'lightgreen' : 'lightgray'}`,
    cursor: 'pointer'
}));

const GridContainer = styled('div')(({ n }: { n: number }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${n}, 1fr)`, // Set the number of columns based on the size prop
    gap: '2px', // This creates the space that looks like grid lines
    backgroundColor: '#000', // Color for the grid lines
}));

const Cell = styled('div')({
    backgroundColor: '#fff',
    height: '100px',
    width: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
});

const Grid = ({ n, value, index }: { n: number, value: string | undefined, index: number }) => {
    return (
        <GridContainer n={n}>
            {Array.from({ length: n * n }, (_, i) => (
                <Cell key={`cell-${i}`}>{i === index ? value : ''}</Cell>
            ))}
        </GridContainer>
    );
};

const mockActionsArray: GameAction[] = ['Seed', 'Harvest', 'PutMouse'] as unknown as GameAction[]

export function SubGame() {
    const { key } = useParams();

    if (!key) {
        throw new Error("No key");
    }

    const n = 3

    const { gameState, handleStart } = useGameState(key)
    const [actions, setActions] = useState<GameAction[]>(mockActionsArray)
    const [selectedAction, setSelectedAction] = useState<GameAction>()
    const [actionGridIndex, setActionGridIndex] = useState()

    const playerId = localStorage.getItem("playerId");

    const player = useMemo(() =>
        gameState?.players.find(({ ID }) => ID === playerId)
        , [playerId, gameState])


    if (gameState?.state === 'waiting') {
        return <Waiting />
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
                <Grid n={n} value={selectedAction} index={5}></Grid>
                <Box display="flex" justifyContent="center">
                    {actions.map((action) =>
                        <Item
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