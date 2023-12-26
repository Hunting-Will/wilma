import Koa from 'koa'
import Router from '@koa/router';
import bodypareser from 'koa-bodyparser';
import cors from '@koa/cors'

import { RealtimeServer } from './realtime-server/RealtimeServer';
import { GameController } from '../game-logic/GameController';
import { getGame, setGame } from './gamesManager'
import { GameAction, GridCell } from '../types';

const { v4: uuidv4 } = require('uuid');

const router = new Router({ prefix: '/api' });

const app = new Koa();
app.use(cors())
app.use(bodypareser())

app.use(async (ctx, next) => {
  console.log(`Received ${ctx.method} request on ${ctx.url}`);
  if (ctx.method === 'POST' || ctx.method === 'PUT') {
    console.log('Body:', ctx.request.body);
  }
  await next();
});


router.get('/createGame/:name', async (ctx) => {
  const { name } = ctx.params;

  if (!name) {
    ctx.status = 400;
    ctx.body = { error: 'Name is required' };
    return;
  }

  const game = new GameController(3, 3)

  setGame(game.key, game);

  ctx.status = 200;
  ctx.body = {
    message: 'Game created successfully',
    name,
    gameId: game.key
  };
});

router.get('/joinGame/:key/:nickname', async (ctx) => {
  const { key, nickname } = ctx.params;

  const player = {
    ID: uuidv4(),
    Nickname: nickname,
    Score: 0
  }

  const game = await getGame(key)
  game.AddPlayer(player)

  await setGame(key, game)
  RealtimeServer.EmitGameState(key, game);

  ctx.status = 200
  ctx.body = { playerId: player.ID }
});

router.get('/game/:key', async (ctx) => {
  const { key } = ctx.params;

  const game = await getGame(key)

  if (game) {
    ctx.body = game;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Game not found' };
  }
});

router.post('/game/:key/simulateTurn', async (ctx) => {
  const { key } = ctx.params;

  const game = await getGame(key)
  const results = game.SimulateTurn()
  await setGame(key, game)

  RealtimeServer.EmitGameResults(key, results);
  RealtimeServer.EmitGameState(key, game);
  ctx.status = 200
  ctx.body = { results }
});

router.post('/game/:key/setAction', async (ctx) => {
  const { key } = ctx.params;
  const { action, playerId, cellId } = ctx.request.body as { action: GameAction, playerId: string, cellId: GridCell['ID'] };

  const game = await getGame(key)
  const player = game.players.find(({ ID }) => ID === playerId)
  game.SetPlayerAction(player, action, cellId)
  RealtimeServer.EmitGameState(key, game);
});

router.get('/game/:key/waitForChoices', async (ctx) => {
  const { key } = ctx.params;

  console.log("I'm here!!!");
  const game = await getGame(key);
  game.WaitForChoices();
  await setGame(key, game)
  RealtimeServer.EmitGameState(key, game);

  ctx.status = 200;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

const port = 3001
app.listen(port, "0.0.0.0");
console.log(`Starting server on ${port}`)