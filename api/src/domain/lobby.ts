import { Law } from '../data/laws';
import { Crisis } from './crisis/crisis';
import { Deck } from './deck';
import { Either, left, right } from './either';
import { Game } from './game';
import { User } from './user';

type LobbyParams = {
  id?: string;
  minPlayers?: number;
  lawsDeck: Deck<Law>;
  crisesDeck: Deck<Crisis>;
};

export class Lobby {
  private _users: Map<string, User> = new Map();
  private _games: Game[] = [];

  private constructor(
    private _crisesDeck: Deck<Crisis>,
    private _lawsDeck: Deck<Law>,
    private _id: string,
    private _minPlayers: number,
  ) {}

  static create(params: LobbyParams): Either<string, Lobby> {
    const { id = '00000', minPlayers = 7, crisesDeck, lawsDeck } = params;
    return right(new Lobby(crisesDeck, lawsDeck, id, minPlayers));
  }

  addUser(user: User): Either<string, void> {
    const users = Array.from(this._users.values());
    if (users.some((u) => u.name === user.name)) {
      return left(`Jogador ${user.name} já está no lobby`);
    }
    this._users.set(user.id, user);
    return right(undefined);
  }

  removeUser(userId: string, issuerId: string): Either<string, void> {
    if (issuerId === userId) {
      return left('Não é possível remover a si mesmo');
    }

    const issuer = this._users.get(issuerId);
    if (!issuer || !issuer.isHost) {
      return left('Apenas o anfitrião pode remover jogadores');
    }

    if (!this._users.has(userId)) {
      return left('Jogador não encontrado');
    }
    this._users.delete(userId);
    return right();
  }

  connectUser(userId: string, socketId: string): Either<string, void> {
    const user = this._users.get(userId);
    if (!user) return left('Jogador não encontrado');
    user.socketId = socketId;
    return right();
  }

  disconnectUser(userId: string): Either<string, void> {
    const user = this._users.get(userId);
    if (!user) return left('Jogador não encontrado');
    user.socketId = null;
    return right();
  }

  isUserConnected(userId: string): boolean {
    const user = this._users.get(userId);
    return Boolean(user?.isConnected);
  }

  startGame(): Either<string, Game> {
    if (this._users.size < this.minPlayers) {
      return left(`Mínimo de ${this.minPlayers} jogadores para iniciar o jogo`);
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

  get id() {
    return this._id;
  }

  get minPlayers() {
    return this._minPlayers;
  }

  toJSON() {
    return {
      users: Array.from(this._users.values()).map((user) => user.toJSON()),
      id: this._id,
      minPlayers: this.minPlayers,
      // games: this._games.map((game) => game.toJSON()),
    };
  }
}
