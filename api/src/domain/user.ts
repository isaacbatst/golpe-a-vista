type UserParams = {
  id: string;
  name: string;
  isHost?: boolean;
  isConnected?: boolean;
};

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly isHost: boolean;
  public socketId: string | null = null;

  constructor({ id, name, isHost }: UserParams) {
    this.id = id;
    this.name = name;
    this.isHost = isHost ?? false;
  }

  get isConnected() {
    return this.socketId !== null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      isHost: this.isHost,
      isConnected: this.isConnected,
    };
  }
}
