import { Player } from './player';

export class PresidentQueue {
  private _players: Player[];
  private _offset: number = 0;

  constructor(_players: Player[]) {
    this._players = [..._players];
  }

  get players(): Player[] {
    return this._players;
  }

  shift(): void {
    this._offset++;
  }

  getByRoundNumber(roundNumber: number): Player {
    return this._players[roundNumber + (this._offset % this._players.length)];
  }
}
