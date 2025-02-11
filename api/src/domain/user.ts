type UserParams = {
  id: string;
  name: string;
  isHost?: boolean;
  isConnected?: boolean;
};

export class User {
  readonly id: string;
  readonly name: string;
  readonly isHost: boolean;
  readonly isConnected: boolean;
  constructor({ id, name, isHost, isConnected }: UserParams) {
    this.id = id;
    this.name = name;
    this.isHost = isHost ?? false;
    this.isConnected = isConnected ?? true;
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
