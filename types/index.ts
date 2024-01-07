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

export type GameState = 'lobby' | 'player-choice' | 'simulating';

export type PlayerAction = {
    player: Player,
    action: GameAction
}

export type Cause = 'harvest-poisoned' | 'harvested' |
    'seeded' | 'poisoned-failed' | 'none' |
    'mouse' | 'snake-ate-mouse'

export type TurnResults = {
    [key: Player['ID']]: {
        scoreChange: number
        cause: Cause
    }[]
}

export type GridCell = {
    pendingActions: PlayerAction[],
    state: CellState,
    ID: string,

};

export type CellState = {
    cellValue: number,
    growing: boolean,
    items: Item[]
}

export type GameAction =
    'PutMouse' |
    'PutSnake' |
    'Seed' |
    'Harvest' |
    'Poison'

export type ItemType = 'Mouse' | 'Snake'
export type Item = {
    type: ItemType,
    playerId: string
}