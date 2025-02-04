export class Random {
  static getFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static extractFromArray<T>(arr: T[]): T {
    // extract random with splice
    const index = Math.floor(Math.random() * arr.length);
    return arr.splice(index, 1)[0];
  }
}