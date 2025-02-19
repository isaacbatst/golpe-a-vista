import { Injectable } from '@nestjs/common';
import { CrisisFactory } from 'src/domain/crisis/crisis-factory';
import CRISES from './data/crises';
import { Law, LAWS } from './data/laws';
import { Crisis } from './domain/crisis/crisis';
import { Deck } from './domain/deck';

@Injectable()
export class DeckRepository {
  private lawsDeck: Deck<Law>;
  private crisesDeck: Deck<Crisis>;

  constructor() {
    const [lawsDeckError, lawsDeck] = Deck.create(LAWS);
    if (!lawsDeck) {
      throw new Error(lawsDeckError);
    }
    this.lawsDeck = lawsDeck;

    const [crisesDeckError, crisesDeck] = Deck.create(
      Object.keys(CRISES).map((key: keyof typeof CRISES) =>
        CrisisFactory.create(key),
      ),
    );
    if (!crisesDeck) {
      throw new Error(crisesDeckError);
    }
    this.crisesDeck = crisesDeck;
  }

  cloneLawsDeck() {
    return this.lawsDeck.clone();
  }

  cloneCrisesDeck() {
    return this.crisesDeck.clone();
  }
}
