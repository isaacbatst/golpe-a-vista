export class PresidentQueue {
  private _players: string[];
  private _offset: number = 0;

  constructor(_players: string[], _offset: number = 0) {
    this._players = _players;
    this._offset = _offset;
  }

  get players(): string[] {
    return this._players;
  }

  get offset(): number {
    return this._offset;
  }

  shift(): void {
    this._offset++;
  }

  getByRoundNumber(roundNumber: number): string {
    return this._players[(roundNumber + this._offset) % this._players.length];
  }

  toJSON() {
    return {
      players: this._players,
      offset: this._offset,
    };
  }

  static fromJSON(data: { players: string[]; offset: number }) {
    return new PresidentQueue(data.players, data.offset);
  }
}
