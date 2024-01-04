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

export type Causes = 'harvest-poisoned' | 'harvested' | 'seeded' | 'poisoned-failed' | 'none' | 'mouse'
export type TurnResults = {
    [key: Player['ID']]: {
        scoreChange: number
        cause: Causes
    }
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

export type ItemTypes = 'Mouse' | 'Snake'
export type Item = {
    type: ItemTypes,
    playerId: string
}