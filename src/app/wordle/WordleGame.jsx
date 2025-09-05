"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const WORDS = ["apple", "grape", "mango", "peach", "berry"];
const ANSWER = WORDS[Math.floor(Math.random() * WORDS.length)];
const KEYS = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

export default function WordleGame() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const username = searchParams.get("username") || "DiscordUser";

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [finished, setFinished] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!guess) return;

    const newGuesses = [...guesses, guess.toLowerCase()];
    setGuesses(newGuesses);
    setGuess("");

    if (guess.toLowerCase() === ANSWER || newGuesses.length >= 6) setFinished(true);
  };

  const handleKeyClick = (key) => {
    if (finished) return;
    if (key === "ENTER") handleSubmit();
    else if (key === "⌫") setGuess(guess.slice(0, -1));
    else if (guess.length < 5) setGuess(guess + key.toLowerCase());
  };

  async function submitScore(success, attempts) {
    if (!userId) return;
    await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, username, game: "wordle", score: success ? 1 : 0, attempts }),
    });
  }

  useEffect(() => {
    if (finished) submitScore(guesses.at(-1) === ANSWER, guesses.length);
  }, [finished]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Wordle Clone</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={guess}
          maxLength={5}
          onChange={(e) => setGuess(e.target.value)}
          disabled={finished}
          className="border-2 border-gray-400 rounded-lg p-2 text-lg text-gray-900"
        />
        <button type="submit" disabled={finished} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Enter
        </button>
      </form>

      <div className="space-y-2 mb-6">
        {guesses.map((g, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg ${g === ANSWER ? "bg-green-500 text-white" : "bg-gray-300 text-gray-900"}`}
          >
            {g}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="grid grid-cols-10 gap-2">
        {KEYS.map((key) => (
          <button
            key={key}
            onClick={() => handleKeyClick(key)}
            disabled={finished}
            className="px-2 py-2 rounded-md bg-gray-200 text-gray-900"
          >
            {key}
          </button>
        ))}
        <button onClick={() => handleKeyClick("ENTER")} disabled={finished} className="col-span-2 px-2 py-2 bg-blue-500 text-white rounded-md">
          ENTER
        </button>
        <button onClick={() => handleKeyClick("⌫")} disabled={finished} className="col-span-2 px-2 py-2 bg-red-500 text-white rounded-md">
          ⌫
        </button>
      </div>

      {finished && (
        <p className="mt-6 text-xl font-semibold">
          {guesses.at(-1) === ANSWER ? "🎉 You solved it!" : `❌ Game Over! The word was ${ANSWER.toUpperCase()}`}
        </p>
      )}
    </div>
  );
}
