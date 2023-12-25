import { GameController } from "../game-logic/GameController";

export interface RealtimeMessage {
    lobby: string,
    route: string,
    payload: string
}

export interface RealtimeServerResponse {
    type: string
}

export interface RealtimeGameState extends RealtimeServerResponse {
    type: "GameState",
    game: GameController
}

export interface RealtimeError extends RealtimeServerResponse{
    type: "Error";
    message: string,
    error: any
}