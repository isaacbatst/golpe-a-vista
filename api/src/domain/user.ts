type UserParams = {
  id: string;
  name: string;
  isHost?: boolean;
  socketId?: string;
};

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly isHost: boolean;
  public socketId: string | null = null;

  constructor({ id, name, isHost, socketId }: UserParams) {
    this.id = id;
    this.name = name;
    this.isHost = isHost ?? false;
    this.socketId = socketId ?? null;
  }

  get isConnected() {
    return this.socketId !== null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      isHost: this.isHost,
      socketId: this.socketId,
      isConnected: this.isConnected,
    };
  }

  static fromJSON(data: ReturnType<User['toJSON']>) {
    return new User({
      ...data,
      socketId: data.socketId ?? undefined,
    });
  }
}
