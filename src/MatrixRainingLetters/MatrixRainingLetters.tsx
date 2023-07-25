import React, { ReactNode, useEffect, useRef } from "react";
import { randomChar, randomGreen, randomNumberBetween } from "./Utils";
import { type Cell, type Column, type Matrix } from "./types";

// export const GREENS = ["#15803d", "#16a34a", "#22c55e", "#4ade80"] as const;
export const GREENS = ["#0D0208", "#003B00", "#008F11", "#22c55e"] as const;

//export const WHITE = "#f0fdf4";
export const WHITE = "#00FF41";

const FRAME_RATE = 1000 / 25;

type MatrixRainingLetterProps = {
  children: ReactNode;
};

export const MatrixRainingLetter: React.FC<MatrixRainingLetterProps> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const WIDTH = 660;
  // const HEIGHT = 440;

  useEffect(() => {
    const WIDTH = canvasRef.current?.clientWidth ?? window.innerWidth;
    const HEIGHT = canvasRef.current?.clientHeight ?? window.innerHeight;
    console.log(HEIGHT, WIDTH);

    const COLUMN_WIDTH = 20;
    const COLUMNS = WIDTH / COLUMN_WIDTH;

    const ROW_HEIGHT = 26;
    const ROWS = Math.ceil(HEIGHT / ROW_HEIGHT);

    function render(matrix: Matrix, ctx: CanvasRenderingContext2D): void {
      //ctx.fillStyle = "rgb(0,16,0)";
      ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      let x = 0;
      for (const column of matrix) {
        let y = ROW_HEIGHT;
        for (const cell of column.cells) {
          ctx.fillStyle = cell.color;
          ctx.fillText(cell.char, x, y);

          y += ROW_HEIGHT;
        }
        x += COLUMN_WIDTH;
      }
    }

    const RAINDROP_SPAWN_RATE = 0.8;
    let tickNo = 0;

    function tick(matrix: Matrix): void {
      for (const column of matrix) {
        if (tickNo % column.speed === 0) {
          continue;
        }

        const animationComplete = column.ticksLeft <= 0;

        if (animationComplete && Math.random() > RAINDROP_SPAWN_RATE) {
          column.speed = randomNumberBetween(1, 6);
          column.trail = randomNumberBetween(3, ROWS * 2);
          column.ticksLeft = ROWS + column.trail;

          column.head = column.cells[0];
          column.head.char = randomChar();
        } else {
          if (column.head) {
            const nextCell = column.cells[column.head.position + 1];

            if (nextCell) {
              column.head = nextCell;

              nextCell.activeFor = column.trail;
            } else {
              column.head = undefined;
            }
          }
          column.ticksLeft -= 1;
        }
        for (const cell of column.cells) {
          if (cell.activeFor > 0) {
            if (column.head === cell) {
              cell.color = WHITE;
              cell.retainColor = 0;
              cell.char = randomChar();
              cell.retainChar = randomNumberBetween(1, 10);
            } else {
              if (cell.retainColor <= 0) {
                cell.color = randomGreen();
                cell.retainColor = randomNumberBetween(1, 10);
              } else {
                cell.retainColor -= 1;
              }
              if (cell.retainChar <= 0) {
                cell.char = randomChar();
                cell.retainChar = randomNumberBetween(1, 10);
              } else {
                cell.retainChar -= 1;
              }
            }

            cell.activeFor -= 1;
          } else {
            cell.char = "";
          }
        }
      }
      tickNo += 1;
    }

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
      if (ctx) {
        ctx.font = "22px mono";
        const matrix: Matrix = createMatrix(COLUMNS, ROWS);

        const intervalId = window.setInterval(() => {
          tick(matrix);
          render(matrix, ctx);
        }, FRAME_RATE);

        return () => {
          window.clearInterval(intervalId);
        };
      }
    }
  }, []);

  function createMatrix(COLUMNS: number, ROWS: number): Matrix {
    const columns: Column[] = [];

    for (let i = 0; i < COLUMNS; i++) {
      const cells: Cell[] = [];

      for (let j = 0; j < ROWS; j++) {
        const cell: Cell = {
          position: j,
          char: "",
          retainChar: 0,
          activeFor: 0,
          color: WHITE,
          retainColor: 0,
        };
        cells.push(cell);
      }
      columns.push({
        cells,
        head: undefined,
        trail: 0,
        ticksLeft: 0,
        speed: 10,
      });
    }
    return columns;
  }

  useEffect(() => {
    function resizeCanvas() {
      if (canvasRef.current) {
        const width = document.body.clientWidth;
        //const height = document.body.clientHeight;

        canvasRef.current.style.width = `${width}px`;
        //canvasRef.current.style.height = `${height}px`;
      }
    }

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="flex-justify-center">
      <canvas ref={canvasRef} style={{ position: "absolute" }}>
        The rain effect of the Matrix film
      </canvas>
      {children}
    </div>
  );
};
