import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import { fetchGame } from '../serverClient';
import type { Game, Player, GameAction } from '../../../types/';
import { subscribe } from '../liveServerClient';
import { GameController } from '../../../game-logic/GameController';

const Item = styled('div')(({ theme }) => ({
    height: 100,
    width: 100,
    margin: 20,
    padding: 10,
    border: "1px solid lightgray"
}));


export function SubGame() {
    const [player, setPlayer] = useState<Player>()
    const [game, setGame] = useState<GameController>()

    const [actions, setAction] = useState(['Seed', 'Harvest'])

    const { id } = useParams();
    const playerId = localStorage.getItem("playerId");

    if (!id) {
        throw new Error("No id");
    }

    console.log(game);

    useEffect(() => {
        const init = async () => {
            const game = await fetchGame(id);
            setGame(game);

            const player = game.players.find(({ ID }) => ID === playerId);
            setPlayer(player);
        };
        init();
    }, []);

    const handleSetAction = (action: string) => {
        alert(action)
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
                    Game {id}, Player {JSON.stringify(player)}
                </Box>
                <Box display="flex" justifyContent="center">
                    {actions.map((action) =>
                        <Item onClick={() => handleSetAction(action)}>{action}</Item>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
