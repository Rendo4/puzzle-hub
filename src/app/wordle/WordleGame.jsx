// src/app/wordle/WordleGame.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const WORDS = ["apple", "grape", "mango", "peach", "berry"];
const ANSWER = WORDS[Math.floor(Math.random() * WORDS.length)];

const KEYBOARD = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"]
];

export default function WordleGame() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const username = searchParams.get("username") || "DiscordUser";

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [finished, setFinished] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!guess) return;

    const newGuesses = [...guesses, guess.toLowerCase()];
    setGuesses(newGuesses);
    setGuess("");

    if (guess.toLowerCase() === ANSWER || newGuesses.length >= 6) {
      setFinished(true);
    }
  }

  function handleKeyboardClick(letter) {
    if (finished) return;
    if (guess.length < 5) {
      setGuess(guess + letter.toLowerCase());
    }
  }

  async function submitScore(success, attempts) {
    if (!userId) return;
    await fetch("/api/score", {
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
  }

  useEffect(() => {
    if (finished) {
      const success = guesses.at(-1) === ANSWER;
      submitScore(success, guesses.length);
    }
  }, [finished]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Wordle Clone</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={guess}
          maxLength={5}
          onChange={(e) => setGuess(e.target.value)}
          disabled={finished}
          className="border-2 border-gray-400 rounded-lg p-2 text-lg text-gray-900"
        />
        <button
          type="submit"
          disabled={finished}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Enter
        </button>
      </form>

      <div className="space-y-2 mb-6">
        {guesses.map((g, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg ${
              g === ANSWER ? "bg-green-500 text-white" : "bg-gray-300 text-gray-900"
            }`}
          >
            {g}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {KEYBOARD.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyboardClick(key)}
                disabled={finished}
                className="w-10 h-10 bg-gray-200 rounded font-bold text-gray-900 hover:bg-gray-300"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {finished && (
        <p className="mt-6 text-xl font-semibold">
          {guesses.at(-1) === ANSWER
            ? "🎉 You solved it!"
            : `❌ Game Over! The word was ${ANSWER.toUpperCase()}`}
        </p>
      )}
    </div>
  );
}
