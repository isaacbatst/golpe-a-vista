import SABOTAGE_CARDS from 'src/data/sabotage-cards';
import { SabotageCard } from 'src/domain/sabotage-card/sabotage-card';
import { SABOTAGE_CARD_NAMES } from 'src/domain/sabotage-card/sabotage-card-names';

export class SabotageCardFactory {
  static create(sabotageCard: SABOTAGE_CARD_NAMES): SabotageCard {
    return new SabotageCard({
      ...SABOTAGE_CARDS[sabotageCard],
    });
  }

  static fromJSON(data: ReturnType<SabotageCard['toJSON']>) {
    return new SabotageCard(data);
  }
}
