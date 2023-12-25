import Koa from 'koa'
import Router from '@koa/router';
import bodypareser from 'koa-bodyparser';
import Redis from 'ioredis'
import cors from '@koa/cors'

import { GameController } from '../game-logic/GameController';
const { v4: uuidv4 } = require('uuid');

const router = new Router({ prefix: '/api' });
const redis = new Redis('redis://:1aaiwdzIvNTH7TKlrehzCfgJI9SgiGmt@redis-11798.c323.us-east-1-2.ec2.cloud.redislabs.com:11798');

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

let games: Record<GameController['key'], GameController> = {};

router.get('/createGame/:name', async (ctx) => {
  const { name } = ctx.params;

  if (!name) {
    ctx.status = 400;
    ctx.body = { error: 'Name is required' };
    return;
  }

  const gameController = new GameController(3, 3)

  await redis.set(gameController.key, JSON.stringify(gameController));

  ctx.status = 200;
  ctx.body = {
    message: 'Game created successfully',
    name,
    gameId: gameController.key
  };
});

router.get('/joinGame/:key/:nickname', async (ctx) => {
  const { key, nickname } = ctx.params;

  const player = {
    ID: uuidv4(),
    Nickname: nickname,
    Score: 0
  }

  const game = await redis.get(key)

  const gameController = Object.assign(new GameController(3, 3), JSON.parse(game))
  gameController.AddPlayer(player)

  await redis.set(key, JSON.stringify(gameController))

  ctx.status = 200
  ctx.body = { playerId: player.ID }

});

router.get('/game/:id', async (ctx) => {
  const { id } = ctx.params;

  // const gameData = games[id]
  const game = await redis.get(id)

  if (game) {
    ctx.body = game;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Game not found' };
  }
});

// router.post('/saveGame/:lobbyId', async (ctx) => {
//   const lobbyId = ctx.params.lobbyId;
//   const newGameData = ctx.request.body;

//   try {
//     const gameData = await redis.get(lobbyId);

//     if (gameData) {
//       const parsedData = JSON.parse(gameData);
//       parsedData.data = newGameData;
//       await redis.set(lobbyId, JSON.stringify(parsedData));
//       ctx.status = 200;
//       ctx.body = { message: 'Game data updated successfully' };
//     } else {
//       ctx.status = 404;
//       ctx.body = { error: 'Game not found' };
//     }
//   } catch (error) {
//     console.error('Redis error:', error);
//     ctx.status = 500;
//     ctx.body = { error: 'Internal server error' };
//   }
// });

app
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

const port = 3001
app.listen(port);
console.log(`Starting server on ${port}`)