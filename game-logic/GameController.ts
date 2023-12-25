import { GameAction, GridCell, Player, TurnResults } from "../types";
import { GridController } from "./GridController";

function generateGameCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export class GameController {

    private gc: GridController;
    public players: Player[];
    public key: string;

    constructor(gridLength: number, gridWidth: number) {
        this.gc = new GridController(gridLength, gridWidth);
        this.players = [];
        this.key = generateGameCode();
    }

    public AddPlayer(player: Player) {
        this.players.push(player);
    }


    public RemovePlayer(id: Player['ID']) {
        this.players = this.players.filter(p => p.ID !== id);
    }

    public SetPlayerAction(player: Player, action: GameAction, cell: GridCell['ID']) {
        this.gc.SetPlayerAction(player, action, cell);
    }

    public SimulateTurn(): TurnResults {
        var results = this.gc.SimulateTurn();
        for (var playerID in Object.keys(results)) {
            this.players[playerID].Score += results[playerID].scoreChange;
        }
        return results;
    }
}