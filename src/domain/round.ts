import { Law } from "../data/laws";
import { Crisis } from "./crisis";
import { Deck } from "./deck";
import { Either, left, right } from "./either";
import { Impeachment } from "./impeachment";
import { Player } from "./player";
import { LawType } from "./role";
import { Voting } from "./voting";

type RoundParams = {
  president: Player;
  lawsDeck: Deck<Law>;
  crisesDeck: Deck<Crisis>;
  crisis?: Crisis | null;
  rapporteur?: Player | null;
  hasImpeachment?: boolean;
};

export class Round {
  private static readonly LAWS_TO_DRAW = 3;

  public rapporteur: Player | null = null;
  public isDossierVisibleToRapporteur = false;
  public nextShouldHaveCrisisPerRejectedLaw = false;
  private _impeached: Player | null = null;
  private _drawnLaws: Law[] = [];
  private _crisis: Crisis | null;
  private _lawToVote: Law | null = null;
  private _lawVoting: Voting | null = null;
  private _crisesDeck: Deck<Crisis>;
  private _lawsDeck: Deck<Law>;
  private _vetoedLaw: Law | null = null;
  private _nextRapporteur: Player | null = null;
  private _sabotageCrisesDrawn: Crisis[] | null = null;
  private _sabotageCrisis: Crisis | null = null;
  private _hasImpeachment: boolean;
  private _impeachment: Impeachment | null = null;

  readonly president: Player;

  constructor(props: RoundParams) {
    this.president = props.president;
    this._crisesDeck = props.crisesDeck;
    this._crisis = props.crisis ?? null;
    this._lawsDeck = props.lawsDeck;
    this._hasImpeachment = props.hasImpeachment ?? false;
    this.rapporteur = props.rapporteur ?? null;
  }

  setNextRapporteur(player: Player) {
    this._nextRapporteur = player;
  }

  drawLaws() {
    const laws = this._lawsDeck.draw(Round.LAWS_TO_DRAW);
    this._drawnLaws = laws;
    return laws;
  }

  chooseLaw(index: number): Either<string, void> {
    if (this._vetoedLaw === this._drawnLaws[index]) {
      return left("Essa lei foi vetada");
    }

    this._lawToVote = this._drawnLaws[index];
    return right();
  }

  canSabotage(): Either<string, boolean> {
    if (!this._lawToVote) {
      return left("Nenhuma lei escolhida para sabotar");
    }

    if (this._lawToVote.type === LawType.CONSERVADORES) {
      return left("Não é possível sabotar uma lei conservadora");
    }

    if (!this.voting?.result) {
      return left("Não é possível sabotar uma lei que não foi aprovada");
    }

    return right(true);
  }

  sabotage(): Either<string, Crisis[]> {
    const [canSabotageError] = this.canSabotage();
    if (canSabotageError) {
      return left(canSabotageError);
    }
    const crises = this._crisesDeck.draw(3);
    this._sabotageCrisesDrawn = crises;
    return right(crises);
  }

  startLawVoting(players: string[]): Either<string, void> {
    if (this._lawVoting) {
      return left("Votação já iniciada");
    }

    if (!this._lawToVote) {
      return left("Nenhuma lei escolhida para votação");
    }

    const [error, voting] = Voting.create(players);

    if (!voting) {
      return left(error);
    }

    this._lawVoting = voting;

    return right(undefined);
  }

  voteForLaw(playerName: string, vote: boolean): Either<string, void> {
    if (!this._lawVoting) {
      return left("Votação não iniciada");
    }

    this._lawVoting.vote(playerName, vote);

    return right(undefined);
  }

  endLawVoting(): Either<string, Law | null> {
    if (!this._lawVoting) {
      return left("Votação não iniciada");
    }

    this._lawVoting.end();
    return this._lawVoting.result ? right(this._lawToVote) : right(null);
  }

  vetoLaw(index: number) {
    this._vetoedLaw = this._drawnLaws[index];
  }

  chooseSabotageCrisis(index: number): Either<string, void> {
    if (!this._sabotageCrisesDrawn) {
      return left("Crises de sabotagem não foram sacadas");
    }
    this._sabotageCrisis = this._sabotageCrisesDrawn[index];
    return right();
  }

  startImpeachment(
    target: Player,
    isSomeConservativeImpeached = false
  ): Either<string, void> {
    if (!this._hasImpeachment) {
      return left("A cassação não está ativa nessa rodada");
    }
    this._impeachment = new Impeachment({
      target,
      accuser: this.president,
      isSomeConservativeImpeached,
    });
    return right();
  }

  startImpeachmentVoting(players: string[]): Either<string, void> {
    if (!this._impeachment) {
      return left("Cassação não iniciada");
    }

    const [error] = this._impeachment.startVoting(players);
    if(error) {
      return left(error);
    }

    return right();
  }

  voteForImpeachment(player: string, approve: boolean): Either<string, void> {
    if (!this._impeachment) {
      return left("Cassação não iniciada");
    }

    const [error] = this._impeachment.vote(player, approve);
    if(error) {
      return left(error);
    }

    return right();
  }

  impeach(player: Player): Either<string, void> {
    if (!this._hasImpeachment) {
      return left("A cassação não está ativa nessa rodada");
    }

    this._impeached = player;
    player.impeached = true;

    return right();
  }

  get sabotageCrisis() {
    return this._sabotageCrisis;
  }

  get sabotageCrisesDrawn(): Crisis[] | null {
    return this.sabotageCrisesDrawn ? [...this._sabotageCrisesDrawn!] : null;
  }

  get drawnLaws() {
    return [...this._drawnLaws];
  }

  get vetoedLaw(): Law | null {
    return this._vetoedLaw;
  }

  get crisis(): Crisis | null {
    return this._crisis;
  }

  get lawToVote(): Law | null {
    return this._lawToVote;
  }

  get voting(): Voting | null {
    return this._lawVoting;
  }

  get votingCount() {
    return this._lawVoting?.count ?? null;
  }

  get votes() {
    return this._lawVoting?.votes ?? null;
  }

  get votingResult() {
    return this._lawVoting?.result ?? null;
  }

  get nextRapporteur() {
    return this._nextRapporteur;
  }

  get hasImpeachment() {
    return this._hasImpeachment;
  }

  get impeached() {
    return this._impeached;
  }

  get impeachment() {
    return this._impeachment;
  }

  get impeachmentVotingCount() {
    return this._impeachment?.votingCount ?? null;
  }
}
