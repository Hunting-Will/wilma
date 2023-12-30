import { Box, Typography, Zoom } from "@mui/material";
import { GameAction, GridCell } from "../../../types";
import { styled } from '@mui/system';
import { useCallback, useEffect, useRef, useState } from "react";

const GridContainer = styled('div')(({ n }: { n: number }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${n}, 1fr)`,
    gap: '10px',
    // backgroundColor: '#000'
}));

const CellDiv = styled('div')(({ n, isGrowing }: { n: number, isGrowing: boolean }) => ({
    height: `min(calc(65vw / ${n}), calc(65vh / ${n}))`,
    width: `min(calc(65vw / ${n}), calc(65vh / ${n}))`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: isGrowing ? 'lightgreen' : 'lightblue',
    borderRadius: 10,
    position: 'relative'
}));

const Cell = ({ v, n, isGrowing, children, onClick, c }: { v: number, n: number, isGrowing: boolean, children: React.ReactNode, onClick: () => void, c: GridCell }) => {
    const lastValue = useRef(-100)
    const [vChange, setVChange] = useState<number | undefined>()
    const [animateScore, setAnimateScore] = useState(false)
    const timer = useRef<NodeJS.Timeout>()

    const startPointAnimation = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current)
        }
        setAnimateScore(true)
        timer.current = setTimeout(() => setAnimateScore(false), 3000)
    }, [setAnimateScore])

    useEffect(() => {
        if (lastValue.current !== -100 && v !== lastValue.current) {
            setVChange(v - lastValue.current)
            startPointAnimation()
        }
        lastValue.current = v
    }, [c, v, startPointAnimation])

    return (
        <CellDiv onClick={onClick} n={n} isGrowing={isGrowing}>
            {children}
            <Typography variant="h3">{v}</Typography>
            <Zoom in={animateScore}>
                <Box position="absolute" left={3} top={3}>
                    <Typography variant="h4">{vChange && vChange > 0 ? '+' : '-'}{vChange}</Typography>
                </Box>
            </Zoom>
        </CellDiv>
    )
}

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
                <Cell key={c.ID} c={c} onClick={() => onSet?.(c.ID)} n={n} isGrowing={c.state.growing} v={c.state.cellValue}>
                    <Box>{c.ID === cellID ? value : ''}</Box>
                </Cell>
            ))}
        </GridContainer>
    );
};