import { GridCell, GameAction, Player, TurnResults } from '../types';

const SEEDING_POINTS = 0.5;

function UUID() {
    return "very safe" + Math.random();
}

export class GridController {
    public grid: GridCell[]

    constructor(gridLength: number, gridWidth: number) {
        this.grid = [...Array(gridLength * gridWidth).keys()].map(GridController.CreateEmptyCell);
    }

    static CreateEmptyCell(): GridCell {
        return {
            ID: UUID(),
            pendingActions: [],
            state: {
                cellValue: 0,
                growing: false
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

    SimulateTurn(): TurnResults {
        var results: TurnResults = {};
        for (var cell of this.grid) {
            var actionAmounts: Partial<Record<GameAction, number>> = {};
            cell.pendingActions.forEach(a => {
                actionAmounts[a.action] = (actionAmounts[a.action] ?? 0) + 1;
            });

            for (var { action, player } of cell.pendingActions) {
                results[player.ID] = results[player.ID] == undefined ? { scoreChange: 0, cause: "none" } : results[player.ID];
                switch (action) {
                    case 'Harvest':
                        const harvesters = (actionAmounts['Harvest'] ?? 0);
                        if ((actionAmounts['Poison'] ?? 0) > 0) {
                            results[player.ID].scoreChange -= cell.state.cellValue / harvesters;
                            results[player.ID].cause = "harvest-poisoned";
                        } else {
                            results[player.ID].scoreChange += cell.state.cellValue / harvesters;
                            results[player.ID].cause = "harvested";
                        }
                        break;
                    case 'Poison':
                        if ((actionAmounts['Harvest'] ?? 0) < 1) {
                            results[player.ID].scoreChange -= cell.state.cellValue / 2;
                            results[player.ID].cause = "poisoned-failed";
                        }
                        break;
                    case 'Seed':
                        results[player.ID].scoreChange += SEEDING_POINTS;
                        results[player.ID].cause = "seeded";
                        break;
                }
            }
            cell.pendingActions = [];

            if ((actionAmounts['Harvest'] ?? 0) > 0) {
                cell.state = {
                    cellValue: 0,
                    growing: false
                };
            }
            if (cell.state.growing == false && (actionAmounts['Seed'] ?? 0) > 0) {
                cell.state.growing = true;
                cell.state.cellValue += 1;
            } else if (cell.state.growing == true) {
                cell.state.cellValue += 1;
            }
        }
        return results;
    }
};