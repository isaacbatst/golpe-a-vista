import CRISES from '../data/crises';
import { Law, LAWS } from '../data/laws';
import { Crisis } from './crisis/crisis';
import { CrisisFactory } from './crisis/crisis-factory';
import { Deck } from './deck';
import { Either, left, right } from './either';
import { Game } from './game';
import { User } from './user';

export class Lobby {
  private _users: Map<string, User> = new Map();
  private _games: Game[] = [];

  private constructor(
    private _crisesDeck: Deck<Crisis>,
    private _lawsDeck: Deck<Law>,
    private _code: string,
  ) {}

  static create(code: string = '0000'): Either<string, Lobby> {
    const [lawsDeckError, lawsDeck] = Deck.create(LAWS);
    if (!lawsDeck) return left(lawsDeckError);
    const [crisesDeckError, crisesDeck] = Deck.create(
      Object.keys(CRISES).map((key: keyof typeof CRISES) =>
        CrisisFactory.createCrisis(key),
      ),
    );
    if (!crisesDeck) return left(crisesDeckError);

    return right(new Lobby(crisesDeck, lawsDeck, code));
  }

  addPlayer(user: User): Either<string, void> {
    const users = Array.from(this._users.values());
    if (users.some((u) => u.name === user.name)) {
      return left(`Jogador ${user.name} já está no lobby`);
    }
    this._users.set(user.name, user);
    return right(undefined);
  }

  startGame(): Either<string, Game> {
    if (this._users.size < 6) {
      return left('Mínimo de 6 jogadores para iniciar o jogo');
    }
    const players = Array.from(this._users.values()).map((m) => m.name);
    const [error, game] = Game.create({
      players: Game.createPlayers(players),
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

  get users() {
    return Array.from(this._users.values());
  }

  get games() {
    return Array.from(this._games.values());
  }

  get code() {
    return this._code;
  }

  toJSON() {
    return {
      users: Array.from(this._users.values()).map((user) => user.toJSON()),
      code: this._code,
      // games: this._games.map((game) => game.toJSON()),
    };
  }
}
