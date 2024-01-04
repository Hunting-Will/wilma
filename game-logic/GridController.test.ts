import { Player, PlayerAction } from '@wilma/types';
import { GROW_POINTS, GridController, SEEDING_POINTS } from './GridController';

describe("grid controller", () => {
    let gc: GridController;
    let samplePlayer1: Player = { ID: "1", Nickname: "AlexHomo", Score: 0 }
    let samplePlayer2: Player = { ID: "2", Nickname: "LiorGever", Score: 0 }
    let samplePlayer3: Player = { ID: "3", Nickname: "LiorTotah", Score: 0 }

    beforeEach(() => {
        gc = new GridController(3, 3)
    });

    describe("player actions", () => {
        it('adds player action', () => {
            gc.SetPlayerAction(samplePlayer1, "Poison", gc.grid[0].ID);
            const expected: PlayerAction[] = [{ action: "Poison", player: samplePlayer1 }];
            expect(gc.grid[0].pendingActions).toEqual(expected);
        });

        it('adds two players same action', () => {
            gc.SetPlayerAction(samplePlayer1, "Poison", gc.grid[0].ID);
            gc.SetPlayerAction(samplePlayer2, "Poison", gc.grid[0].ID);
            const expected: PlayerAction[] = [{ action: "Poison", player: samplePlayer1 }, { action: "Poison", player: samplePlayer2 }];
            expect(gc.grid[0].pendingActions).toEqual(expected);
        });

        it('replaces player action', () => {
            gc.SetPlayerAction(samplePlayer1, "Poison", gc.grid[0].ID);
            gc.SetPlayerAction(samplePlayer2, "Poison", gc.grid[0].ID);
            gc.SetPlayerAction(samplePlayer1, "PutMouse", gc.grid[1].ID);
            const expectedCell1: PlayerAction[] = [{ action: "Poison", player: samplePlayer2 }];
            const expectedCell2: PlayerAction[] = [{ action: "PutMouse", player: samplePlayer1 }];
            expect(gc.grid[0].pendingActions).toEqual(expectedCell1);
            expect(gc.grid[1].pendingActions).toEqual(expectedCell2);
        });
    });

    describe("simulations", () => {
        it('simulates empty', () => {
            expect(() => gc.SimulateTurn()).not.toThrow();
        });

        it('gives points for seeding', () => {
            gc.SetPlayerAction(samplePlayer1, "Seed", gc.grid[0].ID);
            const results = gc.SimulateTurn();
            expect(results[samplePlayer1.ID].scoreChange).toBe(SEEDING_POINTS);
        });

        it('grows seeds and gives proper score on harvest to all harvesting players', () => {
            gc.SetPlayerAction(samplePlayer1, "Seed", gc.grid[0].ID);
            gc.SimulateTurn();
            expect(gc.grid[0].state.cellValue).toEqual(1);
            gc.SimulateTurn();
            expect(gc.grid[0].state.cellValue).toEqual(2)
            gc.SetPlayerAction(samplePlayer1, "Harvest", gc.grid[0].ID);
            const results = gc.SimulateTurn();
            expect(results[samplePlayer1.ID].scoreChange).toBe(2);
        });

        it('grows seeds and gives proper score on harvest to all harvesting players', () => {
            gc.SetPlayerAction(samplePlayer1, "Seed", gc.grid[0].ID);
            gc.SimulateTurn();
            expect(gc.grid[0].state.cellValue).toEqual(1);
            gc.SimulateTurn();
            expect(gc.grid[0].state.cellValue).toEqual(2)
            gc.SetPlayerAction(samplePlayer1, "Harvest", gc.grid[0].ID);
            gc.SetPlayerAction(samplePlayer2, "Harvest", gc.grid[0].ID);
            const results = gc.SimulateTurn();
            expect(results[samplePlayer1.ID].scoreChange).toBe(1);
            expect(results[samplePlayer2.ID].scoreChange).toBe(1);
        });

        it('stops growing after harvest', () => {
            gc.SetPlayerAction(samplePlayer1, "Seed", gc.grid[0].ID);
            gc.SimulateTurn();
            expect(gc.grid[0].state.cellValue).toEqual(GROW_POINTS);

            gc.SetPlayerAction(samplePlayer1, "Harvest", gc.grid[0].ID);
            const results = gc.SimulateTurn();
            gc.SimulateTurn();
            gc.SimulateTurn();
            expect(gc.grid[0].state.cellValue).toEqual(0);
        });

        it('gives correct points when harvesting poison', () => {
            gc.SetPlayerAction(samplePlayer1, "Seed", gc.grid[0].ID);
            gc.SimulateTurn();
            gc.SetPlayerAction(samplePlayer1, "Harvest", gc.grid[0].ID);
            gc.SetPlayerAction(samplePlayer2, "Poison", gc.grid[0].ID);
            const results = gc.SimulateTurn();
            expect(results[samplePlayer1.ID].scoreChange).toEqual(-1);
            expect(results[samplePlayer2.ID].scoreChange).toEqual(0);
        });

        it('gives correct points to all players when harvesting poison', () => {
            gc.SetPlayerAction(samplePlayer1, "Seed", gc.grid[0].ID);
            gc.SimulateTurn();
            gc.SimulateTurn();
            gc.SetPlayerAction(samplePlayer1, "Harvest", gc.grid[0].ID);
            gc.SetPlayerAction(samplePlayer2, "Harvest", gc.grid[0].ID);
            gc.SetPlayerAction(samplePlayer3, "Poison", gc.grid[0].ID);
            const results = gc.SimulateTurn();
            expect(results[samplePlayer1.ID].scoreChange).toEqual(-1);
            expect(results[samplePlayer2.ID].scoreChange).toEqual(-1);
        });

        it('gives correct points when poisoning with no harvesters', () => {
            gc.SetPlayerAction(samplePlayer1, "Seed", gc.grid[0].ID);
            gc.SimulateTurn();
            gc.SetPlayerAction(samplePlayer1, "Poison", gc.grid[0].ID);
            const results = gc.SimulateTurn();
            expect(results[samplePlayer1.ID].scoreChange).toEqual(-0.5);
        });

        it('gives correct points to all players when poisoning with no harvesters', () => {
            gc.SetPlayerAction(samplePlayer1, "Seed", gc.grid[0].ID);
            gc.SimulateTurn();
            gc.SetPlayerAction(samplePlayer1, "Poison", gc.grid[0].ID);
            gc.SetPlayerAction(samplePlayer2, "Poison", gc.grid[0].ID);
            const results = gc.SimulateTurn();
            expect(results[samplePlayer1.ID].scoreChange).toEqual(-0.50);
            expect(results[samplePlayer2.ID].scoreChange).toEqual(-0.50);
        });
    });

    describe("items simulations", () => {
        it('mouse gives points to player each turn', () => {
            gc.SetPlayerAction(samplePlayer1, 'Seed', gc.grid[0].ID);
            gc.SimulateTurn();
            gc.SimulateTurn();
            expect(gc.grid[0].state.cellValue).toEqual(GROW_POINTS * 2)

            gc.SetPlayerAction(samplePlayer1, 'PutMouse', gc.grid[0].ID);
            let results = gc.SimulateTurn();
            expect(results[samplePlayer1.ID].scoreChange).toBe(GROW_POINTS / 2);

            gc.SetPlayerAction(samplePlayer1, 'Seed', gc.grid[1].ID);
            results = gc.SimulateTurn();
            expect(results[samplePlayer1.ID].scoreChange).toBe(SEEDING_POINTS + (GROW_POINTS / 2));
        });

        it('mouse reduces cell value by half of growing', () => {
            gc.SetPlayerAction(samplePlayer1, 'Seed', gc.grid[0].ID);
            gc.SimulateTurn();
            gc.SimulateTurn();
            expect(gc.grid[0].state.cellValue).toEqual(GROW_POINTS * 2)

            gc.SetPlayerAction(samplePlayer1, 'PutMouse', gc.grid[0].ID);
            let results = gc.SimulateTurn();
            expect(gc.grid[0].state.cellValue).toEqual(GROW_POINTS * 2.5)
        });
    })
})