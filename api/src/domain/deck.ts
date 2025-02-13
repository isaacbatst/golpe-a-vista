import { Either, left, right } from './either';
import { Random } from './random';
import { InferSerialized, Serializable } from './serializable';

type Card<T> = Serializable<InferSerialized<T>> & {
  cardType: 'LAW' | 'CRISIS';
};

type DeckJSON<T> = {
  cards: T[];
  allCards: T[];
};

export class Deck<T extends Card<T>> {
  private _cards: T[];
  private _allCards: T[];

  private constructor(cards: T[], allCards?: T[]) {
    this._cards = cards;
    this._allCards = allCards ?? cards;
    this.shuffle();
  }

  static create<T extends Card<T>>(cards: T[]): Either<string, Deck<T>> {
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

  show(n = 1, random = true): T[] {
    if (random) {
      const cards = Random.sort(this._cards);
      return cards.slice(0, n);
    }

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

  toJSON(): DeckJSON<ReturnType<Card<T>['toJSON']>> {
    return {
      cards: this._cards.map((card) => card.toJSON()),
      allCards: this._allCards.map((card) => card.toJSON()),
    };
  }

  static fromJSON<T extends Card<T>>(
    json: DeckJSON<ReturnType<Card<T>['toJSON']>>,
    factory: { fromJSON: (params: ReturnType<Card<T>['toJSON']>) => T },
  ): Deck<T> {
    const cards = json.cards.map((card) => factory.fromJSON(card));
    const allCards = json.allCards.map((card) => factory.fromJSON(card));
    return new Deck(cards, allCards);
  }
}
