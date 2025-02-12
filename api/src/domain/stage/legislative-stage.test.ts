import { describe, expect, it } from 'vitest';
import { Law } from '../../data/laws';
import { ActionController } from '../action-controller';
import { Deck } from '../deck';
import { LawType } from '../role';
import { LegislativeAction, LegislativeStage } from './legislative-stage';

const makeLawsDeck = (
  laws: Law[] = [
    { description: 'Lei 1', type: LawType.CONSERVADORES, name: 'L1' },
    { description: 'Lei 2', type: LawType.CONSERVADORES, name: 'L2' },
    { description: 'Lei 3', type: LawType.CONSERVADORES, name: 'L3' },
    { description: 'Lei 4', type: LawType.CONSERVADORES, name: 'L4' },
  ],
) => {
  const [error, deck] = Deck.create(laws);
  if (!deck) {
    throw new Error(error);
  }
  return deck;
};

describe('Estágio Legislativo', () => {
  it('deve comprar 3 cartas do deck de leis', () => {
    const stage = new LegislativeStage({
      lawsDeck: makeLawsDeck(),
    });
    stage.drawLaws();
    expect(stage.drawnLaws).toHaveLength(3);
  });

  it('deve vetar uma das leis', () => {
    const stage = new LegislativeStage({
      lawsDeck: makeLawsDeck(),
    });
    const [, laws] = stage.drawLaws();
    expect(laws).toBeDefined();
    stage.vetoLaw(0);
    const law = laws![0];
    expect(stage.vetoedLaw).toBe(law);
  });

  it('não deve escolher uma das leis vetadas', () => {
    const stage = new LegislativeStage({
      lawsDeck: makeLawsDeck(),
    });
    stage.drawLaws();
    stage.vetoLaw(0);
    const [error] = stage.chooseLawForVoting(0);
    expect(error).toBe('Essa lei foi vetada.');
  });

  it('deve escolher uma das leis para votação', () => {
    const stage = new LegislativeStage({
      lawsDeck: makeLawsDeck(),
    });
    const [, laws] = stage.drawLaws();
    expect(laws).toBeDefined();
    const law = laws![0];
    stage.vetoLaw(1);
    stage.chooseLawForVoting(0);
    expect(stage.lawToVote).toBe(law);
  });

  it('não deve iniciar votação sem escolher uma lei', () => {
    const stage = new LegislativeStage({
      lawsDeck: makeLawsDeck(),
    });
    const [error] = stage.startVoting(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);
    expect(error).toBe(
      ActionController.unexpectedActionMessage(
        LegislativeAction.START_VOTING,
        LegislativeAction.DRAW_LAWS,
      ),
    );
  });

  it('não deve iniciar votação duas vezes', () => {
    const stage = new LegislativeStage({
      lawsDeck: makeLawsDeck(),
    });
    stage.drawLaws();
    stage.vetoLaw(1);
    stage.chooseLawForVoting(0);
    stage.startVoting(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);
    const [error] = stage.startVoting(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);
    expect(error).toBe(
      ActionController.unexpectedActionMessage(
        LegislativeAction.START_VOTING,
        LegislativeAction.VOTING,
      ),
    );
  });

  it('deve realizar a votação rejeitando a lei sem maioria', () => {
    const stage = new LegislativeStage({
      lawsDeck: makeLawsDeck(),
    });
    stage.drawLaws();
    stage.vetoLaw(1);
    stage.chooseLawForVoting(0);
    stage.startVoting(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);

    const [error1] = stage.vote('p1', true);
    expect(error1).toBeUndefined();
    const [error2] = stage.vote('p2', true);
    expect(error2).toBeUndefined();
    const [error3] = stage.vote('p3', true);
    expect(error3).toBeUndefined();
    const [error4] = stage.vote('p4', false);
    expect(error4).toBeUndefined();
    const [error5] = stage.vote('p5', false);
    expect(error5).toBeUndefined();

    expect(stage.votingCount).toEqual({
      yes: 3,
      no: 2,
      abstention: 1,
    });
    const votes = stage.votes;
    expect(votes).not.toBeNull();
    expect(votes!.get('p1')).toBe(true);
    expect(votes!.get('p2')).toBe(true);
    expect(votes!.get('p3')).toBe(true);
    expect(votes!.get('p4')).toBe(false);
    expect(votes!.get('p5')).toBe(false);
    expect(votes!.get('p6')).toBeNull();

    const [error] = stage.endVoting();
    expect(error).toBeUndefined();
    expect(stage.votingResult).toBeFalsy();
  });

  it('deve realizar a votação aprovando a lei com maioria', () => {
    const stage = new LegislativeStage({
      lawsDeck: makeLawsDeck(),
    });
    stage.drawLaws();
    stage.vetoLaw(1);
    stage.chooseLawForVoting(0);
    stage.startVoting(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);

    const [error1] = stage.vote('p1', true);
    expect(error1).toBeUndefined();
    const [error2] = stage.vote('p2', true);
    expect(error2).toBeUndefined();
    const [error3] = stage.vote('p3', true);
    expect(error3).toBeUndefined();
    const [error4] = stage.vote('p4', true);
    expect(error4).toBeUndefined();
    const [error5] = stage.vote('p5', false);
    expect(error5).toBeUndefined();

    expect(stage.votingCount).toEqual({
      yes: 4,
      no: 1,
      abstention: 1,
    });
    const votes = stage.votes;
    expect(votes).not.toBeNull();
    expect(votes!.get('p1')).toBe(true);
    expect(votes!.get('p2')).toBe(true);
    expect(votes!.get('p3')).toBe(true);
    expect(votes!.get('p4')).toBe(true);
    expect(votes!.get('p5')).toBe(false);

    const [error] = stage.endVoting();
    expect(error).toBeUndefined();
    expect(stage.votingResult).toBeTruthy();
  });

  it('deve finalizar votação automaticamente com todos os votos', () => {
    const stage = new LegislativeStage({
      lawsDeck: makeLawsDeck(),
    });
    stage.drawLaws();
    stage.vetoLaw(1);
    stage.chooseLawForVoting(0);
    stage.startVoting(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);

    const [error1] = stage.vote('p1', true);
    expect(error1).toBeUndefined();
    const [error2] = stage.vote('p2', true);
    expect(error2).toBeUndefined();
    const [error3] = stage.vote('p3', true);
    expect(error3).toBeUndefined();
    const [error4] = stage.vote('p4', true);
    expect(error4).toBeUndefined();
    const [error5] = stage.vote('p5', true);
    expect(error5).toBeUndefined();
    const [error6] = stage.vote('p6', true);
    expect(error6).toBeUndefined();

    expect(stage.votingHasEnded).toBe(true);
  });

  it('deve configurar veto obrigatório para um tipo de lei', () => {
    const cards = Array.from({ length: 3 }, (_, i) => ({
      description: `Lei ${i + 1}`,
      type: i === 0 ? LawType.PROGRESSISTAS : LawType.CONSERVADORES,
      name: `L${i + 1}`,
    }));
    const stage = new LegislativeStage({
      lawsDeck: makeLawsDeck(cards),
      mustVeto: LawType.PROGRESSISTAS,
    });
    stage.drawLaws();
    stage.chooseLawForVoting(0);
    expect(stage.mustVeto).toBe(LawType.PROGRESSISTAS);
    expect(stage.vetoableLaws).toHaveLength(1);
    expect(stage.vetoableLaws).toContainEqual(cards[0]);
    const forbiddenIndex = stage.drawnLaws.findIndex(
      (law) => law.type !== LawType.PROGRESSISTAS,
    );
    const [error] = stage.vetoLaw(forbiddenIndex);
    expect(error).toBe('Essa lei não pode ser vetada.');
  });

  it('deve permitir veto em outro tipo de lei se o tipo obrigatório não for sorteado', () => {
    const cards = Array.from({ length: 3 }, (_, i) => ({
      description: `Lei ${i + 1}`,
      type: LawType.CONSERVADORES,
      name: `L${i + 1}`,
    }));
    const stage = new LegislativeStage({
      lawsDeck: makeLawsDeck(cards),
      mustVeto: LawType.PROGRESSISTAS,
    });
    stage.drawLaws();
    stage.chooseLawForVoting(0);
    expect(stage.mustVeto).toBe(LawType.PROGRESSISTAS);
    expect(stage.vetoableLaws).toHaveLength(3);
    const [error] = stage.vetoLaw(0);
    expect(error).toBeUndefined();
  });
});
