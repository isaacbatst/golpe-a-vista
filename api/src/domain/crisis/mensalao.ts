import { CrisisEffect } from 'src/domain/crisis/crisis-effect';
import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';
import { Either, left, right } from 'src/domain/either';
import { Round } from 'src/domain/round';

export enum MensalaoAction {
  CHOOSE_PLAYER = 'CHOOSE_PLAYER',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

export class Mensalao extends CrisisEffect {
  readonly crisis = CRISIS_NAMES.MENSALAO;
  chosenPlayer: string | null = null;

  constructor(currentAction?: MensalaoAction) {
    super(
      [MensalaoAction.CHOOSE_PLAYER, MensalaoAction.ADVANCE_STAGE],
      currentAction,
    );
  }

  choosePlayer(player: string): Either<string, void> {
    const [error] = this._actionController!.assertCurrentAction(
      MensalaoAction.CHOOSE_PLAYER,
    );
    if (error) {
      return left(error);
    }
    this.chosenPlayer = player;
    this._actionController?.advanceAction();
    return right();
  }

  apply(round: Round): Either<string, void> {
    if (!this.chosenPlayer) {
      return left('Nenhum jogador foi escolhido.');
    }
    round.legislativeForcedVotes.set(this.chosenPlayer, true);
    return right();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      crisis: this.crisis,
      chosenPlayer: this.chosenPlayer,
    } as const;
  }

  static fromJSON(data: ReturnType<Mensalao['toJSON']>) {
    const instance = new Mensalao(data.currentAction as MensalaoAction);
    instance.chosenPlayer = data.chosenPlayer;
    return instance;
  }
}
