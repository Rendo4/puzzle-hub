"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Word list
const WORDS = ["apple", "grape", "mango", "peach", "berry"];
const ANSWER = WORDS[Math.floor(Math.random() * WORDS.length)];

// Keyboard letters
const KEYS = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

export default function WordlePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const username = searchParams.get("username") || "DiscordUser";

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [finished, setFinished] = useState(false);

  // Submit guess
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guess || guess.length !== 5) return;

    const newGuesses = [...guesses, guess.toLowerCase()];
    setGuesses(newGuesses);
    setGuess("");

    if (guess.toLowerCase() === ANSWER || newGuesses.length >= 6) {
      setFinished(true);
    }
  };

  // Click letter on keyboard
  const handleKeyClick = (key) => {
    if (finished) return;
    if (guess.length < 5) setGuess(guess + key.toLowerCase());
  };

  // Delete last letter
  const handleBackspace = () => {
    if (finished) return;
    setGuess(guess.slice(0, -1));
  };

  // Submit score to backend
  const submitScore = async (success, attempts) => {
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
  };

  useEffect(() => {
    if (finished) {
      const success = guesses.at(-1) === ANSWER;
      submitScore(success, guesses.length);
    }
  }, [finished]);

  // Determine letter color
  const getLetterColor = (letter, index, word) => {
    if (letter === ANSWER[index]) return "bg-green-500 text-white";
    if (ANSWER.includes(letter)) return "bg-yellow-400 text-white";
    return "bg-gray-300 text-gray-900";
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 py-10">
      <h1 className="text-5xl font-bold mb-8 text-gray-900">Wordle Clone</h1>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex mb-6">
        <input
          type="text"
          value={guess}
          maxLength={5}
          onChange={(e) => setGuess(e.target.value.toLowerCase())}
          disabled={finished}
          className="border-2 border-gray-400 rounded-lg p-3 text-2xl w-40 text-gray-900"
        />
        <button
          type="submit"
          disabled={finished}
          className="ml-3 px-5 py-3 bg-blue-600 text-white rounded-lg text-xl font-semibold"
        >
          Enter
        </button>
      </form>

      {/* Guesses */}
      <div className="space-y-2 mb-8">
        {guesses.map((word, i) => (
          <div key={i} className="flex space-x-2">
            {word.split("").map((letter, idx) => (
              <div
                key={idx}
                className={`w-12 h-12 flex items-center justify-center rounded-md font-bold text-2xl ${getLetterColor(
                  letter,
                  idx,
                  word
                )}`}
              >
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* On-screen keyboard */}
      <div className="grid grid-cols-10 gap-2 mb-6">
        {KEYS.map((key) => {
          let color = "bg-gray-300 text-gray-900";
          guesses.forEach((word) =>
            word.split("").forEach((letter, idx) => {
              if (letter.toUpperCase() === key) {
                if (letter === ANSWER[idx]) color = "bg-green-500 text-white";
                else if (ANSWER.includes(letter)) color = "bg-yellow-400 text-white";
              }
            })
          );
          return (
            <button
              key={key}
              onClick={() => handleKeyClick(key)}
              disabled={finished}
              className={`w-12 h-12 flex items-center justify-center rounded-md font-bold ${color}`}
            >
              {key}
            </button>
          );
        })}
      </div>

      {/* Backspace button */}
      <button
        onClick={handleBackspace}
        disabled={finished}
        className="mb-6 px-6 py-2 bg-red-500 text-white rounded-lg font-semibold"
      >
        Backspace
      </button>

      {/* End message */}
      {finished && (
        <p className="mt-6 text-2xl font-semibold text-gray-900">
          {guesses.at(-1) === ANSWER
            ? "🎉 You solved it!"
            : `❌ Game Over! The word was ${ANSWER.toUpperCase()}`}
        </p>
      )}
    </div>
  );
}