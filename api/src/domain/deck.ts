import { Either, left, right } from './either';
import { Random } from './random';
import { InferSerialized, Serializable } from './serializable';

export class Deck<T extends Serializable<InferSerialized<T>>> {
  private _cards: T[];
  private _allCards: T[];

  private constructor(cards: T[]) {
    this._cards = cards;
    this._allCards = cards;
    this.shuffle();
  }

  static create<T extends Serializable<InferSerialized<T>>>(
    cards: T[],
  ): Either<string, Deck<T>> {
    if (cards.length === 0) {
      return left('O baralho não pode ser vazio');
    }
    return right(new Deck(cards));
  }

  shuffle(): void {
    this._cards = Random.sort(this._cards);
  }

  draw(n = 1): T[] {
    if (n > this._cards.length) {
      this._cards = this._allCards;
      this.shuffle();
    }

    return this._cards.splice(0, n);
  }

  show(n = 1): T[] {
    return this._cards.slice(0, n);
  }

  clone() {
    return new Deck(this._allCards);
  }

  get size(): number {
    return this._cards.length;
  }

  get allCards(): T[] {
    return this._allCards;
  }

  toJSON(): InferSerialized<T>[] {
    return this._cards.map((card) => card.toJSON());
  }
}
