import { GridCell } from "../../../types";
import { styled } from '@mui/system';

const GridContainer = styled('div')(({ n }: { n: number }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${n}, 1fr)`,
    gap: '2px',
    backgroundColor: '#000', // Color for the grid lines
}));

const Cell = styled('div')(({ n }: { n: number }) => ({
    backgroundColor: '#fff',
    height: `calc((100vh - 200px) / ${n})`,
    width: `calc((100vh - 200px) / ${n})`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
}));


export const Board = ({ grid }: { grid: GridCell[] }) => {
    const n = Math.sqrt(grid.length)

    return (
        <GridContainer n={n}>
            {grid.map((c) => (
                <Cell key={`cell-${c.ID}`} n={n}>{c.state.cellValue}</Cell>
            ))
            }
        </GridContainer >
    );
};
