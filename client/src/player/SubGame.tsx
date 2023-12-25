import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from "@mui/material/Box";
import { fetchGame } from '../serverClient';
import type { Game, Player, GameAction } from '../../../types/';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 100
}));


export function SubGame() {
    const [player, setPlayer] = useState<Player>()
    const [game, setGame] = useState<Game>()

    const [actions, setAction] = useState(['Seed', 'Harvest'])

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
                <Grid container spacing={2}>
                    {actions.map((action) =>
                        <Grid item xs={4}>
                            <Item>{action}</Item>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Box>
    );
}
