"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const WORDS = ["apple", "grape", "mango", "peach", "berry"];
const ANSWER = WORDS[Math.floor(Math.random() * WORDS.length)];

const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M","Backspace","Enter"]
];

export default function WordleGame() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const username = searchParams.get("username") || "DiscordUser";

  const MAX_ATTEMPTS = 6;

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [finished, setFinished] = useState(false);
  const [letterStatus, setLetterStatus] = useState({});

  function handleSubmit() {
    if (!guess || finished) return;

    const normalizedGuess = guess.toLowerCase();
    const newGuesses = [...guesses, normalizedGuess];
    setGuesses(newGuesses);
    setGuess("");

    // Update letter status
    const newStatus = { ...letterStatus };
    for (let i = 0; i < normalizedGuess.length; i++) {
      const letter = normalizedGuess[i].toUpperCase();
      if (ANSWER[i] === normalizedGuess[i]) {
        newStatus[letter] = "correct";
      } else if (ANSWER.includes(normalizedGuess[i])) {
        if (newStatus[letter] !== "correct") newStatus[letter] = "present";
      } else {
        newStatus[letter] = "absent";
      }
    }
    setLetterStatus(newStatus);

    if (normalizedGuess === ANSWER || newGuesses.length >= MAX_ATTEMPTS) {
      setFinished(true);
    }
  }

  function handleKeyClick(key) {
    if (finished) return;

    if (key === "Backspace") {
      setGuess(guess.slice(0, -1));
    } else if (key === "Enter") {
      handleSubmit();
    } else if (guess.length < 5) {
      setGuess(guess + key.toLowerCase());
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

  function getCellColor(letter, idx, guessWord) {
    if (ANSWER[idx] === letter) return "bg-green-500 text-white";
    if (ANSWER.includes(letter)) return "bg-yellow-400 text-white";
    return "bg-gray-300 text-gray-900";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Wordle Clone</h1>

      <div className="mb-6">
        <input
          type="text"
          value={guess}
          maxLength={5}
          disabled={finished}
          onChange={(e) => setGuess(e.target.value.slice(0,5))}
          className="border-2 border-gray-400 rounded-lg p-2 text-lg text-gray-800 w-40 text-center"
        />
        <button
          onClick={handleSubmit}
          disabled={finished || guess.length !== 5}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Enter
        </button>
      </div>

      <div className="space-y-2 mb-6">
        {guesses.map((g, guessIdx) => (
          <div key={guessIdx} className="grid grid-cols-5 gap-2">
            {g.split("").map((letter, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-center font-bold rounded-lg p-2 text-lg ${getCellColor(letter, idx, g)}`}
              >
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1">
            {row.map((key) => {
              const status = letterStatus[key] || "";
              const isSpecial = key === "Backspace" || key === "Enter";
              const bgColor =
                status === "correct"
                  ? "bg-green-500 text-white"
                  : status === "present"
                  ? "bg-yellow-400 text-white"
                  : status === "absent"
                  ? "bg-gray-500 text-white"
                  : isSpecial
                  ? "bg-gray-400 text-white"
                  : "bg-gray-300 text-gray-900";

              return (
                <button
                  key={key}
                  onClick={() => handleKeyClick(key)}
                  disabled={finished}
                  className={`px-3 py-2 rounded-md font-bold ${bgColor}`}
                >
                  {key}
                </button>
              );
            })}
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