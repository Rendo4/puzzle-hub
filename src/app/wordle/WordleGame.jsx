"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const SECRET_WORD = "APPLE"; // you can swap this or randomize later

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export default function WordleGame() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "DiscordUser";

  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  function onKeyPress(key) {
    if (gameOver) return;

    if (key === "ENTER") {
      if (currentGuess.length === WORD_LENGTH) {
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess("");

        if (currentGuess.toUpperCase() === SECRET_WORD) {
          setWon(true);
          setGameOver(true);
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
          setGameOver(true);
        }
      }
    } else if (key === "DEL") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key);
    }
  }

  function getLetterStyle(letter, index, guess) {
    if (!SECRET_WORD.includes(letter)) return "bg-gray-500 text-white";
    if (SECRET_WORD[index] === letter) return "bg-green-500 text-white";
    return "bg-yellow-500 text-white";
  }

  function renderRow(word, isCurrent = false) {
    const letters = word.split("");
    return (
      <div className="flex gap-2 mb-2">
        {Array.from({ length: WORD_LENGTH }).map((_, i) => {
          const letter = letters[i] || "";
          let style = "bg-white text-gray-900 border-2 border-gray-300";
          if (!isCurrent && letter) {
            style = getLetterStyle(letter, i, word);
          }
          return (
            <div
              key={i}
              className={`w-12 h-12 flex items-center justify-center font-bold rounded ${style}`}
            >
              {letter}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">Wordle</h1>
      <p className="mb-6 text-gray-700">Welcome, <span className="font-semibold">{username}</span> 👋</p>

      <div className="mb-6">
        {guesses.map((guess, i) => renderRow(guess))}
        {!gameOver && renderRow(currentGuess, true)}
      </div>

      <div className="space-y-2">
        {KEYS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-2">
            {row.map((k) => (
              <button
                key={k}
                onClick={() => onKeyPress(k)}
                className="w-10 h-12 bg-gray-200 text-gray-800 font-semibold rounded"
              >
                {k}
              </button>
            ))}
            {rIdx === KEYS.length - 1 && (
              <>
                <button
                  onClick={() => onKeyPress("DEL")}
                  className="px-4 h-12 bg-red-400 text-white font-semibold rounded"
                >
                  Del
                </button>
                <button
                  onClick={() => onKeyPress("ENTER")}
                  className="px-4 h-12 bg-green-600 text-white font-semibold rounded"
                >
                  Enter
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="mt-6 text-xl font-bold">
          {won ? (
            <p className="text-green-600">🎉 You guessed the word!</p>
          ) : (
            <p className="text-red-600">❌ Game Over! The word was {SECRET_WORD}.</p>
          )}
        </div>
      )}
    </div>
  );
}