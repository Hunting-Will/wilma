export type Game = {
    key: string;
    players: Player[];
    data: Record<any, any>;
}

export type Player = {
    ID: string,
    Nickname: string,
    Score: number,
}

export type PlayerAction = {
    player: Player,
    action: GameAction
}

export type TurnResults = {
    [key: Player['ID']]: {
        scoreChange: number
    }
}

export type GridCell = {
    pendingActions: PlayerAction[],
    state: CellState,
    ID: string
};

export type CellState = {
    cellValue: number,
    growing: boolean
}

export enum GameAction {
    PutMouse,
    PutSnake,
    Seed,
    Harvest,
    Poison,
}