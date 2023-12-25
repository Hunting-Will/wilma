const baseUrl = 'http://localhost:3001';

export const joinGame = (id: string, nickname: string): Promise<{ playerId: string }> =>
    fetch(`${baseUrl}/api/joinGame/${id}/${nickname}`).then(res => res.json())
