import ws from "ws";
import {
  RealtimeError,
  RealtimeGameState,
  RealtimeMessage,
  RealtimeTurnResults,
} from "../../types/realtime-types";
import { GameController } from "../../game-logic/GameController";
import { TurnResults } from "../../types";

const server = new ws.Server({ port: 8080 });
const gameToClients: { [key: string]: ws.WebSocket[] } = {};

const realtimeRoutes: { [key: RealtimeRoute["path"]]: RealtimeRoute["func"] } =
  {};

export function AddRoute(
  path: RealtimeRoute["path"],
  func: RealtimeRoute["func"]
) {
  realtimeRoutes[path] = func;
}

export type RealtimeRoute = {
  path: string;
  func: (socket: ws.WebSocket, payload: any) => void;
};

export const RealtimeServer = {
  AddRoute,
  EmitGameState: (gameID: string, game: GameController) => {
    const message: RealtimeGameState = { game, type: "GameState" };
    if (!gameToClients[gameID]) {
      gameToClients[gameID] = [];
    }
    gameToClients[gameID].forEach((c) => c.send(JSON.stringify(message)));
  },
  EmitGameResults: (gameID: string, results: TurnResults) => {
    const message: RealtimeTurnResults = {type: "TurnResults", results };
    if (!gameToClients[gameID]) {
      gameToClients[gameID] = [];
    }
    gameToClients[gameID].forEach((c) => c.send(JSON.stringify(message)));
  },
  ...server,
};

server.on("connection", (ws: ws.WebSocket, request) => {
  const urlParams = new URLSearchParams(request.url.substring(1));
  const gameID = urlParams.get("gameID");
  if (!gameToClients[gameID]) {
    gameToClients[gameID] = [];
  }
  console.log("connecting real time client to game ", gameID);
  gameToClients[gameID].push(ws);

  ws.on("close", () => {
    const i = gameToClients[gameID].indexOf(ws);
    if (i !== -1) {
      gameToClients[gameID].splice(i, 1);
    }
  });

  ws.on("message", async (message: string) => {
    try {
      const data = JSON.parse(message) as RealtimeMessage;
      const route = realtimeRoutes[data.route];
      if (!route) {
        const err: RealtimeError = {
          type: "Error",
          error: data,
          message: "Route not found",
        };
        ws.send(JSON.stringify(err));
      } else {
        route(ws, data.payload);
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          type: "Error",
          message: "Error processing message",
          error,
        } as RealtimeError)
      );
    }
  });
});

console.log("WebSocket server started on port 8080");
