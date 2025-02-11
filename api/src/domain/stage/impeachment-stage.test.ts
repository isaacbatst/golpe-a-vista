import { describe, expect, it } from 'vitest';
import { ActionController } from '../action-controller';
import { Player } from '../player';
import { Role } from '../role';
import { ImpeachmentAction, ImpeachmentStage } from './impeachment-stage';

describe('Estágio de Cassação', () => {
  it('deve escolher o alvo', () => {
    const stage = new ImpeachmentStage(new Player('p1', Role.MODERADO));

    stage.chooseTarget(new Player('p2', Role.MODERADO));
    expect(stage.target).toBeDefined();
  });

  it('deve realizar cassação por votação', () => {
    const stage = new ImpeachmentStage(new Player('p1', Role.MODERADO));

    expect(stage.currentAction).toBe(ImpeachmentAction.SELECT_TARGET);
    const [chooseTargetError] = stage.chooseTarget(
      new Player('p2', Role.MODERADO),
    );
    expect(chooseTargetError).toBeUndefined();
    expect(stage.currentAction).toBe(ImpeachmentAction.START_VOTING);
    const [startVotingError] = stage.startVoting(['p1', 'p2']);
    expect(startVotingError).toBeUndefined();
    expect(stage.currentAction).toBe(ImpeachmentAction.VOTING);
    const [voteError1] = stage.vote('p1', true);
    expect(voteError1).toBeUndefined();
    const [voteError2] = stage.vote('p2', true);
    expect(voteError2).toBeUndefined();
    expect(stage.currentAction).toBe(ImpeachmentAction.ADVANCE_STAGE);
    expect(stage.target!.impeached).toBe(true);
  });

  it('deve permitir pular votação um conservador já tiver sido cassado, o alvo for um conservador e o radical ainda não tenha sido cassado', () => {
    const stage = new ImpeachmentStage(new Player('p1', Role.MODERADO), true);

    stage.chooseTarget(new Player('p2', Role.CONSERVADOR));
    expect(stage.shouldSkipVoting).toBe(true);

    const [error] = stage.impeach();
    expect(error).toBeUndefined();
  });

  it('não deve permitir iniciar votação se ela deve ser pulada', () => {
    const stage = new ImpeachmentStage(new Player('p1', Role.MODERADO), true);

    stage.chooseTarget(new Player('p2', Role.CONSERVADOR));
    expect(stage.shouldSkipVoting).toBe(true);

    const [error] = stage.startVoting(['p1', 'p2']);
    expect(error).toBe(
      ActionController.unexpectedActionMessage(
        ImpeachmentAction.START_VOTING,
        ImpeachmentAction.EXECUTION,
      ),
    );
  });
});
