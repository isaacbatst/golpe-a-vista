import { Either, left, right } from "./either";
import { Random } from "./random";

export class Deck<T> {
  private _cards: T[];
  private _allCards: T[];

  private constructor(cards: T[]) {
    this._cards = cards;
    this._allCards = cards;
    this.shuffle();
  }

  static create<T>(cards: T[]): Either<string, Deck<T>> {
    if (cards.length === 0) {
      return left("O baralho não pode ser vazio");
    }
    return right(new Deck(cards));
  }

  shuffle(): void {
    this._cards = Random.sort(this._cards);
  }

  draw(n = 1): T[] {
    return this._cards.splice(0, n);
  }

  get size(): number {
    return this._cards.length;
  }

  get allCards(): T[] {
    return this._allCards;
  }
}