import { Box } from '@mui/material';
import { Game } from '../../../types';



export function Right({ game }: { game: Game }) {

    return (
        <Box flexDirection="column" display="flex">
            <Box sx={{}}>mini map</Box>
            <Box>Timer</Box>
            <Box>Scorenoard</Box>
        </Box>
    );
}
