import CRISES from '../data/crises';
import { Law, LAWS } from '../data/laws';
import { Crisis } from './crisis/crisis';
import { CrisisFactory } from './crisis/crisis-factory';
import { Deck } from './deck';
import { Either, left, right } from './either';
import { Game } from './game';

export class Lobby {
  private _players: string[] = [];
  private _games: Game[] = [];

  private constructor(
    private _crisesDeck: Deck<Crisis>,
    private _lawsDeck: Deck<Law>,
  ) {}

  static create(): Either<string, Lobby> {
    const [lawsDeckError, lawsDeck] = Deck.create(LAWS);
    if (!lawsDeck) return left(lawsDeckError);
    const [crisesDeckError, crisesDeck] = Deck.create(
      Object.keys(CRISES).map((key: keyof typeof CRISES) =>
        CrisisFactory.createCrisis(key),
      ),
    );
    if (!crisesDeck) return left(crisesDeckError);

    return right(new Lobby(crisesDeck, lawsDeck));
  }

  addPlayer(player: string): Either<string, void> {
    if (this._players.includes(player)) {
      return left(`Jogador ${player} já está no lobby`);
    }
    this._players.push(player);
    return right(undefined);
  }

  startGame(): Either<string, Game> {
    if (this._players.length < 6) {
      return left('Mínimo de 6 jogadores para iniciar o jogo');
    }

    const [error, game] = Game.create({
      players: Game.createPlayers(this._players),
      crisesDeck: this._crisesDeck.clone(),
      lawsDeck: this._lawsDeck.clone(),
    });

    if (!game) {
      return left(error);
    }

    this._games.push(game);

    return right(game);
  }

  get currentGame() {
    return this._games[this._games.length - 1];
  }

  get players() {
    return this._players;
  }

  get games() {
    return Array.from(this._games.values());
  }

  toJSON() {
    return {
      players: this._players,
      // games: this._games.map((game) => game.toJSON()),
    };
  }
}
