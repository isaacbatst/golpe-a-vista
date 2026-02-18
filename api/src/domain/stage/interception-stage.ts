import { SabotageCardFactory } from 'src/domain/sabotage-card/sabotage-card-factory';
import { SabotageCard } from '../sabotage-card/sabotage-card';
import { Deck } from '../deck';
import { Either, left, right } from '../either';
import { Stage, StageType } from './stage';

export enum InterceptionAction {
  INTERCEPT_OR_SKIP = 'INTERCEPT_OR_SKIP',
  DRAW_SABOTAGE_CARDS = 'DRAW_SABOTAGE_CARDS',
  CHOOSE_SABOTAGE_CARD = 'CHOOSE_SABOTAGE_CARD',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class InterceptionStage extends Stage {
  readonly type = StageType.INTERCEPTION;
  private _drawnSabotageCards: SabotageCard[] | null;
  private _selectedSabotageCard: SabotageCard | null;

  constructor(
    currentAction?: InterceptionAction,
    sabotageCardsDrawn?: SabotageCard[],
    selectedSabotageCard?: SabotageCard,
  ) {
    super(
      [
        InterceptionAction.INTERCEPT_OR_SKIP,
        InterceptionAction.DRAW_SABOTAGE_CARDS,
        InterceptionAction.CHOOSE_SABOTAGE_CARD,
        InterceptionAction.ADVANCE_STAGE,
      ],
      currentAction,
    );
    this._drawnSabotageCards = sabotageCardsDrawn ?? null;
    this._selectedSabotageCard = selectedSabotageCard ?? null;
  }

  interceptOrSkip(intercept: boolean): Either<string, void> {
    const [error] = this.assertCurrentAction('INTERCEPT_OR_SKIP');
    if (error) return left(error);

    if (intercept) {
      this.advanceAction();
    } else {
      this.advanceAction(InterceptionAction.ADVANCE_STAGE);
    }
    return right();
  }

  drawSabotageCards(sabotageCardsDeck: Deck<SabotageCard>): Either<string, SabotageCard[]> {
    const [error] = this.assertCurrentAction('DRAW_SABOTAGE_CARDS');
    if (error) return left(error);

    this._drawnSabotageCards = sabotageCardsDeck.draw(3);
    this.advanceAction();
    return right(this._drawnSabotageCards);
  }

  chooseSabotageCard(index: number): Either<string, void> {
    const [error] = this.assertCurrentAction('CHOOSE_SABOTAGE_CARD');
    if (error) return left(error);

    if (!this._drawnSabotageCards) {
      return left('Cartas de sabotagem não foram sacadas');
    }

    this._selectedSabotageCard = this._drawnSabotageCards[index];
    this.advanceAction();
    return right();
  }

  get selectedSabotageCard(): SabotageCard | null {
    return this._selectedSabotageCard;
  }

  get drawnSabotageCards(): SabotageCard[] | null {
    return this._drawnSabotageCards;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      currentAction: this.currentAction as InterceptionAction,
      selectedSabotageCard: this._selectedSabotageCard?.toJSON(),
      drawnSabotageCards: this._drawnSabotageCards?.map((card) => card.toJSON()),
    } as const;
  }

  static fromJSON(
    data: ReturnType<InterceptionStage['toJSON']>,
  ): InterceptionStage {
    const stage = new InterceptionStage(
      data.currentAction,
      data.drawnSabotageCards?.map((card) => SabotageCardFactory.fromJSON(card)),
      data.selectedSabotageCard
        ? SabotageCardFactory.fromJSON(data.selectedSabotageCard)
        : undefined,
    );
    return stage;
  }
}
