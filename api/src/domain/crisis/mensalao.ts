import { CrisisEffect } from 'src/domain/crisis/crisis-effect';
import { CRISIS_NAMES } from 'src/domain/crisis/crisis-names';
import { Either, left, right } from 'src/domain/either';
import { Round } from 'src/domain/round';

export enum MensalaoAction {
  SET_MIRROR_ID = 'SET_MIRROR_ID',
  CHOOSE_PLAYER = 'CHOOSE_PLAYER',
  ADVANCE_STAGE = 'ADVANCE_STAGE',
}

type Params = {
  currentAction?: MensalaoAction;
  mirrorId?: string;
  chosenPlayers?: Set<string>;
};

export class Mensalao extends CrisisEffect {
  readonly crisis = CRISIS_NAMES.MENSALAO;
  readonly chosenPlayers: Set<string>;
  private mirrorId: string | null;

  constructor({
    currentAction,
    mirrorId,
    chosenPlayers = new Set<string>(),
  }: Params = {}) {
    super(
      [
        MensalaoAction.SET_MIRROR_ID,
        MensalaoAction.CHOOSE_PLAYER,
        MensalaoAction.ADVANCE_STAGE,
      ],
      currentAction,
    );
    this.mirrorId = mirrorId ?? null;
    this.chosenPlayers = chosenPlayers;
  }

  setMirrorId(player: string): Either<string, void> {
    const [error] = this._actionController!.assertCurrentAction(
      MensalaoAction.SET_MIRROR_ID,
    );
    if (error) {
      return left(error);
    }
    this.mirrorId = player;
    this._actionController?.advanceAction();
    return right();
  }

  choosePlayers(player: string[]): Either<string, void> {
    const [error] = this._actionController!.assertCurrentAction(
      MensalaoAction.CHOOSE_PLAYER,
    );
    if (error) {
      return left(error);
    }
    if (player.length > 3) {
      return left('Você só pode escolher até 3 jogadores.');
    }
    for (const p of player) {
      this.chosenPlayers.add(p);
    }
    this._actionController?.advanceAction();
    return right();
  }

  apply(round: Round): Either<string, void> {
    if (!this.mirrorId && this.chosenPlayers.size > 0) {
      return left('Nenhum jogador foi escolhido para ser espelhado.');
    }

    for (const player of this.chosenPlayers) {
      round.mirroedVotes.set(player, this.mirrorId!);
    }
    return right();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      crisis: this.crisis,
      chosenPlayers: [...this.chosenPlayers],
      mirrorId: this.mirrorId,
      maxSelectedPlayers: 3,
    } as const;
  }

  static fromJSON(data: ReturnType<Mensalao['toJSON']>) {
    return new Mensalao({
      chosenPlayers: new Set(data.chosenPlayers),
      currentAction: data.currentAction as MensalaoAction,
      mirrorId: data.mirrorId ?? undefined,
    });
  }
}
