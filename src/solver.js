/**
 * Solve the N-Queens problem using backtracking.
 * Returns an array of solutions, where each solution is an array
 * of column positions indexed by row (solution[row] = col).
 */
export function solveNQueens(dim) {
  const solutions = [];
  const colPlacement = new Array(dim).fill(0);

  function solve(row) {
    if (row === dim) {
      solutions.push([...colPlacement]);
      return;
    }

    for (let col = 0; col < dim; col++) {
      if (
        colPlacement.every((c, r) => {
          if (r >= row) return true;
          return [0, row - r].indexOf(Math.abs(c - col)) < 0;
        })
      ) {
        colPlacement[row] = col;
        solve(row + 1);
      }
    }
  }

  solve(0);
  return solutions;
}

/**
 * Compute the set of forbidden squares given placed queens.
 * Returns a Set of "row,col" strings.
 */
export function getForbiddenSquares(queens, dim) {
  const forbidden = new Set();

  for (const { row, col } of queens) {
    for (let i = 0; i < dim; i++) {
      forbidden.add(`${row},${i}`);
      forbidden.add(`${i},${col}`);
    }
    for (let d = 1; d < dim; d++) {
      if (row - d >= 0 && col - d >= 0) forbidden.add(`${row - d},${col - d}`);
      if (row - d >= 0 && col + d < dim) forbidden.add(`${row - d},${col + d}`);
      if (row + d < dim && col - d >= 0) forbidden.add(`${row + d},${col - d}`);
      if (row + d < dim && col + d < dim) forbidden.add(`${row + d},${col + d}`);
    }
  }

  return forbidden;
}
