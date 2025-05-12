import { useState } from 'react';
import Player from './components/Player';
import GameBoard from './components/GameBoard';
import Log from './components/Log';
import { WINNING_COMBINATIONS } from './winningCombinations';
import GameOver from './components/GameOver';

function deriveActivePlayer(gameTurns) {
  let activePlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    activePlayer = 'O';
  }

  return activePlayer;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);

  const initialGameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  
  let gameBoard = [...initialGameBoard].map(innerArr => [...innerArr]);
  
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
  
    gameBoard[row][col] = player;
  }  

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      let curPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        {square: { row: rowIndex, col: colIndex }, player: curPlayer },
         ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  let winner = undefined;

  for (const combination of WINNING_COMBINATIONS) {
    let firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    let secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    let thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];
  
    if (firstSquareSymbol &&
        firstSquareSymbol === secondSquareSymbol &&
        firstSquareSymbol === thirdSquareSymbol) {
      winner = firstSquareSymbol;
    }
  } 

  const isDraw = gameTurns.length == 9 && !winner;

  function handleRestart() {
    setGameTurns([]);
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName="Player 1" symbol="X" isActive={activePlayer === 'X'}/>
          <Player initialName="Player 2" symbol="O" isActive={activePlayer === 'O'} />
        </ol>
        {(winner || isDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
        <GameBoard
          onSelectSquare={handleSelectSquare} activePlayerSymbol={activePlayer}
          board = {gameBoard}
        />
      </div>
      <Log turns={gameTurns} />
    </main>
  )
}

export default App
