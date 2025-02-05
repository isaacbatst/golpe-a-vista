export class Random {
  static getFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static extractFromArray<T>(arr: T[]): T {
    const index = Math.floor(Math.random() * arr.length);
    return arr.splice(index, 1)[0];
  }

  static sort<T>(arr: T[]): T[] {
    return arr.slice().sort(() => Math.random() - 0.5);
  }
}