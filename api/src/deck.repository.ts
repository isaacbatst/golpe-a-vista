import { Injectable } from '@nestjs/common';
import { SabotageCardFactory } from 'src/domain/sabotage-card/sabotage-card-factory';
import SABOTAGE_CARDS from './data/sabotage-cards';
import { Law, LAWS } from './data/laws';
import { SabotageCard } from './domain/sabotage-card/sabotage-card';
import { Deck } from './domain/deck';

@Injectable()
export class DeckRepository {
  private lawsDeck: Deck<Law>;
  private sabotageCardsDeck: Deck<SabotageCard>;

  constructor() {
    const [lawsDeckError, lawsDeck] = Deck.create(LAWS);
    if (!lawsDeck) {
      throw new Error(lawsDeckError);
    }
    this.lawsDeck = lawsDeck;

    const [sabotageCardsDeckError, sabotageCardsDeck] = Deck.create(
      Object.keys(SABOTAGE_CARDS).map((key: keyof typeof SABOTAGE_CARDS) =>
        SabotageCardFactory.create(key),
      ),
    );
    if (!sabotageCardsDeck) {
      throw new Error(sabotageCardsDeckError);
    }
    this.sabotageCardsDeck = sabotageCardsDeck;
  }

  cloneLawsDeck() {
    return this.lawsDeck.clone();
  }

  cloneSabotageCardsDeck() {
    return this.sabotageCardsDeck.clone();
  }
}
