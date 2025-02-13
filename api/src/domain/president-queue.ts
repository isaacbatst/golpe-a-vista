import { Player } from './player';

export class PresidentQueue {
  private _players: Player[];
  private _offset: number = 0;

  constructor(_players: Player[], _offset: number = 0) {
    this._players = _players;
    this._offset = _offset;
  }

  get players(): Player[] {
    return this._players;
  }

  get offset(): number {
    return this._offset;
  }

  shift(): void {
    this._offset++;
  }

  getByRoundNumber(roundNumber: number): Player {
    return this._players[roundNumber + (this._offset % this._players.length)];
  }

  toJSON() {
    return {
      players: this._players.map((player) => player.toJSON()),
      offset: this._offset,
    };
  }

  static fromJSON(data: { players: Player[]; offset: number }) {
    return new PresidentQueue(data.players, data.offset);
  }
}
