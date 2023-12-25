import Koa from 'koa'
const app = new Koa();

console.log("Starting server on 3000")
app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

app.listen(3000);