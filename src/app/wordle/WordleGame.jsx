"use client";

import { useState, useEffect } from "react";

const WORDS = ["APPLE", "GRAPE", "MANGO", "BERRY", "PEACH"];

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

export default function WordleGame({ userId, username }) {
  const [solution, setSolution] = useState(getRandomWord);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const wordLength = solution.length;
  const keyboardRows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["Enter", ..."ZXCVBNM".split(""), "⌫"],
  ];

  // Submit score to Supabase
  async function submitScore(success, attempts) {
    if (!userId) return;
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          username,
          game: "wordle",
          score: success ? 1 : 0,
          attempts,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        console.error("Failed to save score:", data.error);
      }
    } catch (err) {
      console.error("Error submitting score:", err);
    }
  }

  // Handle guess submission
  const handleSubmitGuess = () => {
    if (currentGuess.length !== wordLength || gameOver) return;
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === solution) {
      setGameOver(true);
      submitScore(true, newGuesses.length);
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
      submitScore(false, newGuesses.length);
    }
  };

  // Handle keyboard input
  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (key === "Enter") {
      handleSubmitGuess();
    } else if (key === "⌫") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < wordLength && /^[A-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key);
    }
  };

  // Letter status for coloring
  const getLetterStatus = (letter, index, guess) => {
    if (!solution.includes(letter)) return "bg-gray-400 text-white";
    if (solution[index] === letter) return "bg-green-500 text-white";
    return "bg-yellow-500 text-white";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Wordle</h1>

      {/* Render only actual guesses + current guess */}
      <div className="flex flex-col gap-2 mb-6">
        {guesses.map((guess, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-5 gap-2">
            {Array.from({ length: wordLength }).map((_, colIdx) => {
              const letter = guess[colIdx] || "";
              return (
                <div
                  key={colIdx}
                  className={`w-14 h-14 border-2 flex items-center justify-center text-xl font-bold uppercase rounded ${getLetterStatus(
                    letter,
                    colIdx,
                    guess
                  )}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}

        {/* Show current guess being typed */}
        {!gameOver && (
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: wordLength }).map((_, colIdx) => {
              const letter = currentGuess[colIdx] || "";
              return (
                <div
                  key={colIdx}
                  className={`w-14 h-14 border-2 flex items-center justify-center text-xl font-bold uppercase rounded ${
                    letter ? "bg-blue-200 border-blue-400" : "bg-white border-gray-300"
                  }`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* On-screen keyboard */}
      <div className="space-y-2">
        {keyboardRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center space-x-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="px-3 py-2 bg-gray-200 rounded font-semibold text-lg text-gray-800 shadow hover:bg-gray-300"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* End messages */}
      {gameOver && (
        <div className="mt-6 text-2xl font-semibold">
          {guesses[guesses.length - 1] === solution
            ? "🎉 You guessed it!"
            : `❌ Game Over! The word was ${solution}`}
        </div>
      )}
    </div>
  );
}
