import { Box } from '@mui/material';
import { Player } from '../../../types';



export function Right({ players }: { players: Player[] }) {

    return (
        <Box flexDirection="column" display="flex">
            <Box sx={{}}>mini map</Box>
            <Box>Timer</Box>
            <Box>Scorenoard</Box>
        </Box>
    );
}
