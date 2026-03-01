import { useState, useMemo, useCallback } from 'react';
import { solveNQueens, getForbiddenSquares } from './solver.js';
import './App.css';

export default function App() {
  const [dim, setDim] = useState(8);
  const [queens, setQueens] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [message, setMessage] = useState(null);

  const forbidden = useMemo(() => getForbiddenSquares(queens, dim), [queens, dim]);

  const queenSet = useMemo(() => {
    const set = new Set();
    for (const { row, col } of queens) set.add(`${row},${col}`);
    return set;
  }, [queens]);

  const isSolved = useMemo(() => {
    return queens.length === dim;
  }, [queens, dim]);

  const changeDim = useCallback((newDim) => {
    const clamped = Math.max(4, Math.min(12, newDim));
    setDim(clamped);
    setQueens([]);
    setSolutions([]);
    setSolutionIndex(0);
    setMessage(null);
  }, []);

  const reset = useCallback(() => {
    setQueens([]);
    setSolutions([]);
    setSolutionIndex(0);
    setMessage(null);
  }, []);

  const undo = useCallback(() => {
    setQueens((q) => q.slice(0, -1));
    setSolutions([]);
    setSolutionIndex(0);
    setMessage(null);
  }, []);

  const solve = useCallback(() => {
    setQueens([]);
    setMessage(null);
    const results = solveNQueens(dim);
    setSolutions(results);
    setSolutionIndex(0);
    if (results.length > 0) {
      setQueens(results[0].map((col, row) => ({ row, col })));
      setMessage(`${results.length} solution${results.length > 1 ? 's' : ''} found`);
    } else {
      setMessage('No solutions');
    }
  }, [dim]);

  const goToSolution = useCallback(
    (index) => {
      if (index < 0 || index >= solutions.length) return;
      setSolutionIndex(index);
      setQueens(solutions[index].map((col, row) => ({ row, col })));
    },
    [solutions]
  );

  const handleSquareClick = useCallback(
    (row, col) => {
      if (solutions.length > 0) return;

      const key = `${row},${col}`;
      if (queenSet.has(key)) {
        setQueens((q) => q.filter((queen) => !(queen.row === row && queen.col === col)));
        setMessage(null);
        return;
      }

      if (forbidden.has(key)) {
        setMessage('That square is under attack');
        setTimeout(() => setMessage(null), 1500);
        return;
      }

      const newQueens = [...queens, { row, col }];
      setQueens(newQueens);
      if (newQueens.length === dim) {
        setMessage('Solved!');
      } else {
        setMessage(null);
      }
    },
    [queens, queenSet, forbidden, solutions, dim]
  );

  const board = [];
  for (let row = 0; row < dim; row++) {
    for (let col = 0; col < dim; col++) {
      const key = `${row},${col}`;
      const isQueen = queenSet.has(key);
      const isForbidden = !isQueen && forbidden.has(key);
      const isLight = (row + col) % 2 === 0;

      let className = 'square';
      className += isLight ? ' light' : ' dark';
      if (isQueen) className += ' queen';
      else if (isForbidden) className += ' forbidden';

      board.push(
        <div
          key={key}
          className={className}
          onClick={() => handleSquareClick(row, col)}
        >
          {isQueen && <span className="queen-icon">♛</span>}
        </div>
      );
    }
  }

  return (
    <div className="app">
      <div className="toolbar">
        <div className="size-control">
          <button onClick={() => changeDim(dim - 1)} disabled={dim <= 4}>−</button>
          <span className="dim-display">{dim}</span>
          <button onClick={() => changeDim(dim + 1)} disabled={dim >= 12}>+</button>
        </div>

        <div className="actions">
          <button onClick={reset}>Reset</button>
          <button onClick={undo} disabled={queens.length === 0 || solutions.length > 0}>Undo</button>
          <button className="solve-btn" onClick={solve}>Solve</button>
        </div>
      </div>

      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${dim}, 1fr)` }}
      >
        {board}
      </div>

      <div className="footer-bar">
        {solutions.length > 1 && (
          <div className="solution-nav">
            <button onClick={() => goToSolution(solutionIndex - 1)} disabled={solutionIndex === 0}>‹</button>
            <span>{solutionIndex + 1} / {solutions.length}</span>
            <button onClick={() => goToSolution(solutionIndex + 1)} disabled={solutionIndex === solutions.length - 1}>›</button>
          </div>
        )}
        {message && (
          <div className={`message ${isSolved ? 'success' : ''}`}>{message}</div>
        )}
      </div>
    </div>
  );
}
