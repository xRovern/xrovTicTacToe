import React, {ReactNode, useState} from 'react';
import './App.css';

type SquareValue = 'X' | 'O' | null;
let GameStatus = "game-status hide";
let BoardStatus = "board hide";
let Player = "player";
let Keyword = "keyword hide";

const calculateWinner = (squares: SquareValue[]): SquareValue => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

interface SquareProps {
  onClick(): void;
  value: SquareValue;
}

const Square: React.FC<SquareProps> = props => {
  return (
    <div className="square" onClick={props.onClick}>
      {props.value}
    </div>
  );
};

interface ButtonProps {
  onClick(): void;
  value: any;
}

const Button:React.FC<ButtonProps> = props  => {
  return (
    <div className="button" onClick={props.onClick}>
      {props.value}
    </div>
  );
};

const Game: React.FC = () => {
  const [squares, setSquare] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const words = ["1-Player", "2-Players"];
  const keyValue = ["X-First", "O-Second"];
  const [ai, setAI] = useState<String>('');
  const [human, setHuman] = useState<String>('');
  let winner = calculateWinner(squares);

  const renderMove = (i: number) => {
    const nextSquare = squares.slice()
    nextSquare[i] = xIsNext ? "X" : "O";
    setXIsNext(!xIsNext);
    setSquare(nextSquare);
  };

  const renderSquare = (i: number): ReactNode => {
    return (
      <Square
        value={squares[i]}
        onClick={() => {
          if (squares[i] == null && winner == null){
            renderMove(i);
          }
        }}
      />
    );
  };

  const renderButton = (i:number): ReactNode => {
    return(
      <Button
        value={words[i]}
        onClick={() => {
          if(words[i] === "2-Players"){
            setXIsNext(true)
            setSquare(Array(9).fill(null))
            GameStatus = "game-status";
            BoardStatus = "board";
            Player = "player hide";
            Keyword = "keyword hide";
          }
          else {
            setXIsNext(true)
            setSquare(Array(9).fill(null))
            Player = "player hide";
            Keyword = "keyword";
          }
        }}
      />
    );
  };

  const renderKey = (i:number): ReactNode => {
    return(
      <Button
        value={keyValue[i]}
        onClick={() => {
          setXIsNext(true)
          setSquare(Array(9).fill(null))
          Player = "player hide";
          GameStatus = "game-status";
          BoardStatus = "board";
          Keyword = "keyword hide";
          (keyValue[i] === "X-First") ? setAI('O') : setAI('X');
          (keyValue[i] === "X-First") ? setHuman('X') : setHuman('O');
        }}
      />
    );
  };

  const bestMove = () => {
    // AI to make its turn
    let bestScore = -Infinity;
    let move = -1;
    
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = ai;
        let score = minimax(squares, 0, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    if (ai === "X" && squares.every(function(i) { return i == null})) {
      let probability = 0.6; //set higher chance of move at 4
      ((Math.random() *1) < probability) ? move = 4: move =Math.floor((Math.random() * 9) + 1);
    }
    renderMove(move);
  }

  const minimax = (board: Array<any>, depth: number, isMaximizing: boolean) => {
    let scores;
    if (ai === "X"){
      scores = {
        X: 10,
        draw: 0,
        O: -10
      };
    }
    else{
      scores = {
        X : -10,
        draw : 0,
        O : 10
      };
    }
    winner = calculateWinner(squares);
    if(winner!= null){
      return scores[winner];
    }else if (squares.every(function(i) { return i !== null; }) && winner == null) {
      return scores['draw'];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = ai;
          let score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = human;
          let score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  let status;
  if (winner) {
    status = winner + " Win!";
  } else if (squares.every(function(i) { return i !== null; }) && winner == null) {
    status = "Draw!";
  } else {
    status = (xIsNext ? "X" : "O") + " Turns";
  }

  return (
    <div className="game">
      <div className={Player}>
        {words.map((value, key) => renderButton(key))}
      </div>
      <div className={Keyword}>
        {keyValue.map((value, key) => renderKey(key))}
      </div>
      <div className={GameStatus}>
        <Button
          value={"New Game"}
          onClick={() => {
            setXIsNext(true)
            setSquare(Array(9).fill(null))
            setAI('');
            GameStatus = "game-status hide";
            BoardStatus = "board hide";
            Player = "player";
            Keyword = "keyword hide";
            }
          }
        />
        {status} 
      </div>
      <div className="game-board">
        <div className={BoardStatus}>{squares.map((value,key) => renderSquare(key))}</div>
        {ai === (xIsNext ? "X" : "O") ? bestMove(): null}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <p>Tic-Tac-Toe Game</p>
      </div>
      <div className="App-body">
        <Game />
      </div>
    </div>
  );
}

export default App;