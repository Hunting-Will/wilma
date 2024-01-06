import { GridCell, GameAction, Player, TurnResults, Item, Causes, PlayerAction } from '@wilma/types';

export const SEEDING_POINTS = 0.5;
export const GROW_POINTS = 1;
export const MOUSE_POINTS = GROW_POINTS / 2;
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
            console.log(cellWithPlayer)
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
        console.log(JSON.stringify(actionAmounts))
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
        for (const { type, playerId } of cell.state.items) {
            this.results[playerId] = []
            switch (type) {
                case 'Mouse':
                    const mouseEffect = GROW_POINTS / 2;
                    cell.state.cellValue -= mouseEffect; // Decrease cell value due to mouse

                    this.results[playerId].push({ scoreChange: mouseEffect, cause: 'mouse' })
                    break;

                // Handle other items like 'Snake' 
            }
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
};