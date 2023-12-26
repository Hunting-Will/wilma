import { Box } from '@mui/material';
import { Game } from '../../../types';

import { styled } from '@mui/system';

const Tile = styled('div')({
    backgroundColor: 'lightblue',
    width: 200,
    height: 200,
    borderRadius: '8px',
    margin: 5
});

export function Board() {

    const n = 3

    const rows = new Array(n).fill(null);
    const columns = new Array(n).fill(null);

    return (
        <Box flexDirection="column" display="flex">
            {rows.map((_, rowIndex) => (
                <Box key={rowIndex} display="flex">
                    {columns.map((_, columnIndex) => (
                        <Tile key={columnIndex} />
                    ))}
                </Box>
            ))}
        </Box>
    );
}
