"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const WORDS = ["REACT", "NEXT", "PUZZLE", "CODES", "GAMES"]; // sample word list
const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
];

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function WordleGame() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "defaultUserId";
  const username = searchParams.get("username") || "DiscordUser";

  const [solution] = useState(getRandomWord);
  const [guesses, setGuesses] = useState([]);   // each guess is a string
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const maxGuesses = 6;

  function handleKey(key) {
    if (gameOver) return;

    if (key === "ENTER") {
      if (currentGuess.length === solution.length) {
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess("");

        if (currentGuess === solution) {
          setGameOver(true);
          setWon(true);
        } else if (newGuesses.length >= maxGuesses) {
          setGameOver(true);
        }
      }
    } else if (key === "DEL") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < solution.length) {
      setCurrentGuess(currentGuess + key);
    }
  }

  function getLetterStatus(letter, index, guess) {
    if (!solution.includes(letter)) return "absent";
    if (solution[index] === letter) return "correct";
    return "present";
  }

  function renderRow(guess, isCurrent = false) {
    const letters = guess.split("");
    const empty = Array(solution.length - letters.length).fill("");

    return (
      <div className="flex gap-2 mb-2">
        {letters.map((letter, i) => {
          const status = !isCurrent ? getLetterStatus(letter, i, guess) : "";
          let bg = "bg-white border-2 border-gray-300 text-gray-900";
          if (status === "correct") bg = "bg-green-500 text-white";
          if (status === "present") bg = "bg-yellow-500 text-white";
          if (status === "absent") bg = "bg-gray-400 text-white";

          return (
            <div
              key={i}
              className={`w-12 h-12 flex items-center justify-center font-bold uppercase rounded ${bg}`}
            >
              {letter}
            </div>
          );
        })}
        {empty.map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-12 h-12 border-2 border-gray-300 rounded"
          />
        ))}
      </div>
    );
  }

  function renderKeyboard() {
    return (
      <div className="flex flex-col gap-2 mt-6">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className="w-10 h-14 bg-gray-200 text-gray-900 font-bold rounded shadow"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={() => handleKey("ENTER")}
            className="px-4 h-14 bg-purple-600 text-white font-bold rounded shadow"
          >
            ENTER
          </button>
          <button
            onClick={() => handleKey("DEL")}
            className="px-4 h-14 bg-red-500 text-white font-bold rounded shadow"
          >
            DEL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Wordle</h1>

      {/* Render guesses */}
      {guesses.map((guess, i) => renderRow(guess, false))}

      {/* Current row */}
      {!gameOver && guesses.length < maxGuesses && renderRow(currentGuess, true)}

      {/* Empty rows */}
      {Array(maxGuesses - guesses.length - (gameOver ? 0 : 1))
        .fill("")
        .map((_, i) => (
          <div
            key={`filler-${i}`}
            className="flex gap-2 mb-2"
          >
            {Array(solution.length)
              .fill("")
              .map((_, j) => (
                <div
                  key={j}
                  className="w-12 h-12 border-2 border-gray-300 rounded"
                />
              ))}
          </div>
        ))}

      {/* Keyboard */}
      {renderKeyboard()}

      {/* End messages */}
      {gameOver && won && (
        <p className="mt-6 text-2xl font-semibold text-green-700">
          🎉 You guessed it! The word was {solution}.
        </p>
      )}
      {gameOver && !won && (
        <p className="mt-6 text-2xl font-semibold text-red-700">
          ❌ Game Over! The word was {solution}.
        </p>
      )}
    </div>
  );
}
