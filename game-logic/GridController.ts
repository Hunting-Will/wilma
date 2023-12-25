import {GridCell, GameAction, Player, TurnResults} from '../types';

const SEEDING_POINTS = 0.5;

function UUID(){
    return "very safe"+Math.random();
}

export class GameRunner{
    private grid: GridCell[]

    constructor(gridLength: number, gridWidth: number){
        this.grid = [...Array(gridLength * gridWidth).keys()].map(GameRunner.CreateEmptyCell);
    }

    static CreateEmptyCell():GridCell{
        return {
            ID: UUID(),
            pendingActions: [],
            state: {
                cellValue: 0,
                growing: true
            }
        }
    }

    SetPlayerAction(player: Player, action: GameAction, cell: GridCell['ID']){
        this.grid.find(c => c.ID == cell)?.pendingActions.push({action, player});
    }

    SimulateTurn():TurnResults {
        var results:TurnResults = {};
        for(var cell of this.grid){
            var actionAmounts = cell.pendingActions.reduce((acc, {action}) => acc[action] == undefined ? acc[action] = 1 : acc[action] += 1, {});

            for(var {action, player} of cell.pendingActions){
                results[player.ID] = results[player.ID] == undefined ? {scoreChange: 0} : results[player.ID];
                switch(action){
                    case GameAction.Harvest:
                        if(actionAmounts[GameAction.Poison] > 0){
                            results[player.ID].scoreChange -= cell.state.cellValue;
                        } else {
                            results[player.ID].scoreChange += cell.state.cellValue;   
                        }
                        break;
                    case GameAction.Poison:
                        if(actionAmounts[GameAction.Harvest] < 1){
                            results[player.ID].scoreChange -= cell.state.cellValue/2;
                        }
                        break;
                    case GameAction.Seed:
                        results[player.ID].scoreChange += SEEDING_POINTS;
                }
            }
            cell.pendingActions = [];

            if(actionAmounts[GameAction.Harvest] > 0){
                cell.state = {
                    cellValue: 0,
                    growing: false
                };
            }
            if(cell.state.growing == false && actionAmounts[GameAction.Seed] > 0){
                cell.state.growing = true;
            } else if(cell.state.growing == true){
                cell.state.cellValue += 1;
            }
        }
        return results;
    }
};