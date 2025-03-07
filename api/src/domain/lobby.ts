import { Law } from '../data/laws';
import { Crisis } from './crisis/crisis';
import { Deck } from './deck';
import { Either, left, right } from './either';
import { Game } from './game';
import { User } from './user';

type LobbyParams = {
  id?: string;
  minPlayers?: number;
  games?: Game[];
  users?: Map<string, User>;
};

export type LobbyJSON = ReturnType<Lobby['toJSON']>;

export class Lobby {
  private constructor(
    private _id: string,
    private _minPlayers: number,
    private _games: Game[] = [],
    private _users: Map<string, User> = new Map(),
  ) {}

  static create(params: LobbyParams = {}): Either<string, Lobby> {
    const { id = '00000', minPlayers = 7 } = params;
    return right(new Lobby(id, minPlayers));
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

  startGame(
    userId: string,
    crisesDeck: Deck<Crisis>,
    lawsDeck: Deck<Law>,
  ): Either<string, Game> {
    if (userId !== this.host?.id) {
      return left('Apenas o anfitrião pode iniciar o jogo');
    }

    if (this._users.size < this.minPlayers) {
      return left(`Mínimo de ${this.minPlayers} jogadores para iniciar o jogo`);
    }
    const players = Array.from(this._users.values()).map<[string, string]>(
      (m) => [m.id, m.name],
    );
    const [error, game] = Game.create({
      players: Game.createPlayers(players),
      crisesDeck,
      lawsDeck,
    });

    if (!game) {
      return left(error);
    }

    this._games.push(game);

    return right(game);
  }

  reset(issuerId: string): Either<string, void> {
    if (issuerId !== this.host?.id) {
      return left('Apenas o anfitrião pode reiniciar o lobby');
    }
    this._games = [];
    return right();
  }

  hasUser(userId: string): boolean {
    return this._users.has(userId);
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

  get host() {
    return Array.from(this._users.values()).find((u) => u.isHost);
  }

  toJSON() {
    return {
      users: Array.from(this._users.values()).map((user) => user.toJSON()),
      id: this._id,
      minPlayers: this.minPlayers,
      currentGame: this.currentGame?.toJSON(),
      games: this._games.map((game) => game.toJSON()),
    };
  }

  static fromJSON(data: LobbyJSON): Lobby {
    const lobby = new Lobby(
      data.id,
      data.minPlayers,
      data.games.map((game) => Game.fromJSON(game)),
      new Map(data.users.map((user) => [user.id, User.fromJSON(user)])),
    );

    return lobby;
  }
}
