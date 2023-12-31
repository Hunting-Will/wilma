import { Box, Slide, Typography, Zoom } from "@mui/material";
import { GameAction, GridCell } from "@wilma/types";
import { styled } from '@mui/system';
import { useCallback, useEffect, useRef, useState } from "react";
import { actions } from ".";

const GridContainer = styled('div')(({ n }: { n: number }) => ({
    display: 'grid',
    aspectRatio: 1,
    gridTemplateColumns: `repeat(${n}, 1fr)`,
    gridTemplateRows: `repeat(${n}, 1fr)`,
    gap: '5px',
    width: '100%'
}));

const CellDiv = styled('div')(({ n, isGrowing }: { n: number, isGrowing: boolean }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: isGrowing ? '	#c0e1c0' : 'white',
    border: '3px solid #a2a2d8',
    borderRadius: 10,
    position: 'relative',
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
        timer.current = setTimeout(() => setAnimateScore(false), 5000)
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
            <Box position="absolute" left={3} top={3}><Typography variant="h4">{v}</Typography></Box>
            <Slide direction="down" in={animateScore}>
                <Zoom in={animateScore}>
                    <Box position="absolute" left={-5} top={-35}>
                        <Typography variant="h4">{vChange && vChange > 0 ? '+' : ''}{vChange}</Typography>
                    </Box>
                </Zoom>
            </Slide>
        </CellDiv>
    )
}

type Props = {
    grid?: GridCell[],
    cellID?: string,
    onSet?: (cellId: string) => void,
    selectedAction?: GameAction,
    isMain: boolean
}

export const Grid = ({ grid, cellID, onSet, selectedAction, isMain }: Props) => {
    const n = Math.sqrt(grid?.length || 0)
    const action = actions.find((a) => a.action === selectedAction)

    return (
        <GridContainer n={n}>
            {grid?.map((c) => (
                <Cell key={c.ID} c={c} onClick={() => onSet?.(c.ID)} n={n} isGrowing={c.state.growing} v={c.state.cellValue}>
                    {c.ID === cellID && <img alt={action?.action} src={action?.img}></img>}
                </Cell>
            ))}
        </GridContainer>
    );
};