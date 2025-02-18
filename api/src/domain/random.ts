export class Random {
  static getFromArray<T>(arr: ReadonlyArray<T>): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static extractFromArray<T>(arr: T[]): T {
    const index = Math.floor(Math.random() * arr.length);
    return arr.splice(index, 1)[0];
  }

  static sort<T>(arr: T[]): T[] {
    return arr.slice().sort(() => Math.random() - 0.5);
  }

  static boolean(): boolean {
    return Math.random() < 0.5;
  }

  // better algorithm
  // static shuffle<T>(arr: T[]): T[] {
  //   const shuffled = arr.slice();
  //   for (let i = shuffled.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  //   }
  //   return shuffled;
  // }
}
