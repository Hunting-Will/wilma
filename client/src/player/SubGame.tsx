import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import Box from "@mui/material/Box";
import { fetchGame } from '../serverClient';
import type { Player, GameAction } from '../../../types/';
import { subscribe } from '../liveServerClient';
import { GameController } from '../../../game-logic/GameController';
import { RealtimeGameState } from '../../../types/realtime-types';

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

const Grid = ({ n }: { n: number }) => {
    return (
        <GridContainer n={n}>
            {Array.from({ length: n * n }, (_, index) => (
                <Cell key={`cell-${index}`}>Cell {index + 1}</Cell>
            ))}
        </GridContainer>
    );
};

const mockActionsArray: GameAction[] = ['Seed', 'Harvest', 'PutMouse']

export function SubGame() {
    const n = 3
    const [player, setPlayer] = useState<Player>()
    const [game, setGame] = useState<GameController>()

    const [actions, setActions] = useState<GameAction[]>(mockActionsArray)
    const [selectedAction, setSelectedAction] = useState<GameAction>()

    const { key } = useParams();
    const playerId = localStorage.getItem("playerId");

    if (!key) {
        throw new Error("No key");
    }

    const handleData = (data: RealtimeGameState) => {
        setGame(data.game);
    }

    useEffect(() => {
        const init = async () => {
            const game = await fetchGame(key)
            subscribe(key, handleData)

            const player = game.players.find(({ ID }) => ID === playerId);
            setPlayer(player);
        };
        init();
    }, []);

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
                <Grid n={n}></Grid>
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
