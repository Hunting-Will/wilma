import Koa from 'koa'
import Router from '@koa/router';
// import bodypareser from 'koa-bodyparser';
import Redis from 'ioredis'

const app = new Koa();
const router = new Router({ prefix: '/api' });
const redis = new Redis();

function generateGameCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

router.get('/createGame/:lobbyName', async (ctx) => {
  const lobbyName = ctx.params.lobbyName;

  if (!lobbyName) {
    ctx.status = 400;
    ctx.body = { error: 'Lobby name is required' };
    return;
  }

  const gameCode = generateGameCode();
  const gameData = {
    key: gameCode,
    players: [], // Initially an empty array
    data: {} // Empty object, to be filled with game-specific data
  };

  // Save game data in Redis
  await redis.set(gameCode, JSON.stringify(gameData));

  ctx.status = 200;
  ctx.body = {
    message: 'Game created successfully',
    lobbyName: lobbyName,
    gameCode: gameCode
  };
});


app
  .use(router.routes())
  .use(router.allowedMethods());

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(3000);
console.log("Starting server on 3000")