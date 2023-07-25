import { GREENS, WHITE } from "./MatrixRainingLetters";

export type Color = typeof WHITE | (typeof GREENS)[number];

export type Cell = {
  position: number;
  char: string;
  activeFor: number;
  retainChar: number;
  color: Color;
  retainColor: number;
};

export type Column = {
  cells: Cell[];
  head?: Cell;
  trail: number;
  ticksLeft: number;
  speed: number;
};

export type Matrix = Column[];
