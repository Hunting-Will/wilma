import { GameAction, GameState, GridCell, Player, TurnResults } from "@wilma/types";
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

    public gc: GridController;
    public players: Player[];
    public key: string;
    public state: GameState = 'lobby';

    constructor(gridLength: number, gridWidth: number) {
        this.gc = new GridController(gridLength, gridWidth);
        this.players = [];
        this.key = generateGameCode();
    }

    public WaitForChoices() {
        this.state = 'player-choice';
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
        this.state = 'simulating'
        const results = this.gc.SimulateTurn();
        const arr = Object.keys(results)
        for (const playerID of Object.keys(results)) {

            const player = this.players.find(p => p.ID === playerID)
            player && (player.Score += results[playerID].scoreChange);
        }
        console.log('simulated')
        console.log(JSON.stringify(results))
        return results;
    }
}