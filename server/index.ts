import Koa from 'koa'
import Router from '@koa/router';
import bodypareser from 'koa-bodyparser';
import Redis from 'ioredis'
import { Game } from '../types';
const { v4: uuidv4 } = require('uuid');

const app = new Koa();
const router = new Router({ prefix: '/api' });
const redis = new Redis();
app.use(bodypareser())

app.use(async (ctx, next) => {
  console.log(`Received ${ctx.method} request on ${ctx.url}`);
  if (ctx.method === 'POST' || ctx.method === 'PUT') {
    console.log('Body:', ctx.request.body);
  }
  await next(); // Pass control to the next middleware
});

function generateGameCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

router.get('/createGame/:lobbyId', async (ctx) => {
  const { lobbyId } = ctx.params;

  if (!lobbyId) {
    ctx.status = 400;
    ctx.body = { error: 'Lobby name is required' };
    return;
  }

  const gameCode = generateGameCode();
  const gameData: Game = {
    key: gameCode,
    players: [],
    data: {}
  };

  await redis.set(gameCode, JSON.stringify(gameData));

  ctx.status = 200;
  ctx.body = {
    message: 'Game created successfully',
    lobbyName: lobbyId,
    gameCode: gameCode
  };
});

router.get('/joinGame/:lobbyId/:playerName', async (ctx) => {
  const { lobbyId, playerName } = ctx.params;
  const playerId = uuidv4();

  try {
    const gameData = await redis.get(lobbyId);

    if (gameData) {
      const parsedData = JSON.parse(gameData);
      parsedData.players.push({ id: playerId, name: playerName });
      await redis.set(lobbyId, JSON.stringify(parsedData));

      ctx.status = 200;
      ctx.body = { playerId: playerId };
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Game not found' };
    }
  } catch (error) {
    console.error('Redis error:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to join game' };
  }
});

router.post('/saveGame/:lobbyId', async (ctx) => {
  const lobbyId = ctx.params.lobbyId;
  const newGameData = ctx.request.body;

  try {
    const gameData = await redis.get(lobbyId);

    if (gameData) {
      const parsedData = JSON.parse(gameData);
      parsedData.data = newGameData;
      await redis.set(lobbyId, JSON.stringify(parsedData));
      ctx.status = 200;
      ctx.body = { message: 'Game data updated successfully' };
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Game not found' };
    }
  } catch (error) {
    console.error('Redis error:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(3000);
console.log("Starting server on 3000")