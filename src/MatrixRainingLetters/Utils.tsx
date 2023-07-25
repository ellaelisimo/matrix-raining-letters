import { GREENS } from "./MatrixRainingLetters";
import { MATRIX_CHARACTERS } from "./MatrixCharacters";
import { Color } from "./types";

export function randomChar(): string {
  return randomFromArray(MATRIX_CHARACTERS);
}

export function randomGreen(): Color {
  return randomFromArray(GREENS);
}

export function randomFromArray<T>(array: readonly T[]): T {
  const random = Math.floor(Math.random() * array.length);

  return array[random];
}

export function randomNumberBetween(min: number, max: number): number {
  return Math.ceil(Math.random() * (max - min) + min);
}