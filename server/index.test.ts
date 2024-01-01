const request = require('supertest');
const { app } = require('./');


test('Creart game', async () => {
    const name = 'Game'
    const response = await request(app.callback())
        .get(`/api/createGame/${name}`)

        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

    const data = JSON.parse(response.text)
    expect(data.gameId).not.toBeFalsy()
    expect(data.name).toBe(name);
});