import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from "@mui/material/Box";
import { fetchGame } from '../serverClient';
import { Game, Player } from '../../../types';

export function SubGame() {
    const [player, setPlayer] = useState<Player>()
    const [game, setGame] = useState<Game>()

    const { id } = useParams();
    const playerId = localStorage.getItem('playerId')

    if (!id) {
        throw new Error('No id')
    }

    console.log(game)

    useEffect(() => {
        const init = async () => {
            const game = await fetchGame(id);
            setGame(game)

            const player = game.players.find(({ ID }) => ID === playerId)
            setPlayer(player)
        }
        init()
    }, [])

    return (

        <Box
            flexDirection="column"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            Game {id}, Player {JSON.stringify(player)}
        </Box>
    );
}
