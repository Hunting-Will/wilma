import { GridCell } from "../../../types";
import { styled } from '@mui/system';

const GridContainer = styled('div')(({ n }: { n: number }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${n}, 1fr)`,
    gap: '2px',
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


export const Grid = ({ grid, value, selectecID, onSet }: { grid: GridCell[], value: string | undefined, selectecID: string, onSet: (cellId: string) => void }) => {
    const n = Math.sqrt(grid.length)

    return (
        <GridContainer n={n}>
            {grid.map((v) => (
                <Cell key={`cell-${v.ID}`} onClick={() => onSet(v.ID)}>{v.ID === selectecID ? value : ''}</Cell>
            ))}
        </GridContainer>
    );
};