type Left<L> = [L, undefined];
type Right<R> = R extends void ? [undefined] : [undefined, R];

export type Either<L, R> = Left<L> | Right<R>;

export const left = <L>(value: L): Left<L> => [value, undefined];

export const right = <R>(value?: R): Right<R> =>
  (value === undefined ? [undefined] : [undefined, value]) as Right<R>;
