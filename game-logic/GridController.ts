import { GridCell, GameAction, Player, TurnResults, Item, Cause, PlayerAction, ItemType } from '@wilma/types';

export const SEEDING_POINTS = 0.5;
export const GROW_POINTS = 1;
export const MOUSE_POINTS = GROW_POINTS / 2;
export const SNAKE_POINTS = GROW_POINTS / 2;

function UUID() {
    return "very safe" + Math.random();
}

interface ActionContext {
    player: Player;
    cell: GridCell;
    actionAmounts: Partial<Record<GameAction, number>>;
}

type ActionHandler = (context: ActionContext) => void;

export class GridController {
    public grid: GridCell[]
    results: TurnResults = {};

    constructor(gridLength: number, gridWidth: number) {
        this.grid = [...Array(gridLength * gridWidth).keys()].map(GridController.CreateEmptyCell);
    }

    static CreateEmptyCell(): GridCell {
        return {
            ID: UUID(),
            pendingActions: [],
            state: {
                cellValue: 0,
                growing: false,
                items: []
            }
        }
    }

    SetPlayerAction(player: Player, action: GameAction, cellId: GridCell['ID']) {
        // Check if there is already an action by the player and remove it
        const cellWithPlayer = this.grid.find(c => c.pendingActions.map(pa => pa.player.ID).includes(player.ID))
        if (cellWithPlayer) {
            cellWithPlayer.pendingActions = cellWithPlayer.pendingActions.filter(pa => pa.player.ID !== player.ID)
        }

        // Add new action
        this.grid.find(c => c.ID == cellId)?.pendingActions.push({ action, player });
    }

    handleHarvest: ActionHandler = ({ player, cell, actionAmounts }) => {
        const harvesters = actionAmounts['Harvest'] ?? 0;
        if (actionAmounts['Poison'] ?? 0 > 0) {
            this.results[player.ID].push({
                scoreChange: -cell.state.cellValue / harvesters,
                cause: 'harvest-poisoned'
            });
        } else {
            this.results[player.ID].push({
                scoreChange: cell.state.cellValue / harvesters,
                cause: 'harvested'
            });
        }
    }

    handlePoison: ActionHandler = ({ player, cell, actionAmounts }) => {
        if ((actionAmounts['Harvest'] || 0) === 0) {
            this.results[player.ID].push({
                scoreChange: -cell.state.cellValue / 2,
                cause: 'poisoned-failed'
            });
        }
    }

    handleSeed: ActionHandler = ({ player }) => {
        this.results[player.ID].push({
            scoreChange: SEEDING_POINTS,
            cause: 'seeded'
        });
    }

    handlePutMouse: ActionHandler = ({ cell, player }) => {
        cell.state.items.push({ type: 'Mouse', playerId: player.ID });
    }

    handlePutSnake: ActionHandler = ({ cell, player }) => {
        cell.state.items.push({ type: 'Snake', playerId: player.ID });
    }


    SimulateTurn(): TurnResults {
        this.results = {};

        const actionHandlers = {
            'Harvest': this.handleHarvest,
            'Poison': this.handlePoison,
            'Seed': this.handleSeed,
            'PutMouse': this.handlePutMouse,
            'PutSnake': this.handlePutSnake,
        };

        for (const cell of this.grid) {
            const actionAmounts = this.calculateActionAmounts(cell.pendingActions);

            for (const actionEntry of cell.pendingActions) {
                const { action, player } = actionEntry;
                if (!this.results[player.ID]) {
                    this.results[player.ID] = [];
                }

                const handler = actionHandlers[action];
                if (handler) {
                    handler({ player, cell, actionAmounts });
                }
            }

            this.updateCellState(cell, actionAmounts);
            cell.pendingActions = [];
        }
        return this.results;
    }
    calculateActionAmounts = (actions: PlayerAction[]) =>
        actions.reduce<Partial<Record<GameAction, number>>>((acc, a) => ({
            ...acc,
            [a.action]: (acc[a.action] ?? 0) + 1
        }), {});

    addResult = (playerId: Player['ID'], scoreChange: number, cause: Cause) => {
        (this.results[playerId] = this.results[playerId] || []).push({ scoreChange, cause });
    }
    updateCellState = (cell: GridCell, actionAmounts: Partial<Record<GameAction, number>>) => {
        // Reset cell if harvested
        if (actionAmounts['Harvest'] ?? 0 > 0) {
            cell.state = {
                cellValue: 0,
                growing: false,
                items: []
            };
        }

        // Handle seeding and growth
        if (cell.state.growing) {
            cell.state.cellValue += GROW_POINTS; // Increment cell value if already growing
        } else if (actionAmounts['Seed'] ?? 0 > 0) {
            cell.state.growing = true; // Start growing if seeded this turn
            cell.state.cellValue += 1; // Initial growth value (can be adjusted)
        }

        // Handle items effect
        const itemsByName = cell.state.items.reduce<Partial<Record<ItemType, Item[]>>>((acc, item) =>
            ((acc[item.type] = acc[item.type] ?? []).push(item), acc)
            , {})
        const snakeCount = itemsByName['Snake']?.length || 0
        const mouseCount = itemsByName['Mouse']?.length || 0

        if (snakeCount) {
            if (mouseCount > 0) {
                this.handleSnakeEatsMice(cell, itemsByName['Snake'], itemsByName['Mouse'])
            }
        } else if (mouseCount) {
            this.handleMouse(cell, itemsByName['Mouse'])
        }

        // Check if cell value has dropped to zero or below
        if (cell.state.cellValue <= 0) {
            cell.state = {
                cellValue: 0,
                growing: false,
                items: []
            };
        }
    }

    removeAllItemsOfType = (cell: GridCell, itemType: ItemType) => {
        cell.state.items = cell.state.items.filter(({ type }) => type !== itemType);
    }

    handleSnakeEatsMice = (cell: GridCell, snakeItems?: Item[], mouseItems?: Item[]) => {
        const snakeCount = snakeItems?.length || 0
        const mouseCount = mouseItems?.length || 0
        snakeItems?.forEach(({ playerId }) =>
            this.addResult(playerId, (SNAKE_POINTS * mouseCount) / snakeCount, 'mouse'))

        this.removeAllItemsOfType(cell, 'Mouse')
    }

    handleMouse = (cell: GridCell, miceItems?: Item[]) => {
        miceItems?.forEach(({ playerId }) => {
            cell.state.cellValue -= MOUSE_POINTS;
            this.addResult(playerId, MOUSE_POINTS, 'mouse');
        });
    }
};