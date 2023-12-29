import { Box } from "@mui/material";
import { GameAction, GridCell } from "../../../types";
import { styled } from '@mui/system';

const GridContainer = styled('div')(({ n }: { n: number }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${n}, 1fr)`,
    gap: '10px',
    // backgroundColor: '#000'
}));

const Cell = styled('div')(({ n }: { n: number }) => ({
    height: `min(calc(65vw / ${n}), calc(65vh / ${n}))`,
    width: `min(calc(65vw / ${n}), calc(65vh / ${n}))`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: 'lightblue',
    borderRadius: 10
}));

type Props = {
    grid?: GridCell[],
    cellID?: string,
    onSet?: (cellId: string) => void,
    value?: GameAction | undefined
}

export const Grid = ({ grid, cellID, onSet, value }: Props) => {
    const n = Math.sqrt(grid?.length || 0)

    return (
        <GridContainer n={n}>
            {grid?.map((c) => (
                <Cell key={c.ID} onClick={() => onSet?.(c.ID)} n={n}>
                    <Box>{c.ID === cellID ? value : ''}</Box>
                    <Box>{c.state.cellValue}</Box>

                </Cell>
            ))}
        </GridContainer>
    );
};