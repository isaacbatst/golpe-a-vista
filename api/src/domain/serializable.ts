export interface Serializable<T = unknown> {
  toJSON(): T;
}

export type InferSerialized<T> = T extends Serializable<infer U> ? U : never;
