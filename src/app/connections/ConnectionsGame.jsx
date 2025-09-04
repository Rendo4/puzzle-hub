"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CONNECTIONS_GROUPS } from "@/data/connectionsGroups";

function shuffle(array) {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

function pickRandomGroups(list, count) {
  const shuffled = shuffle(list);
  return shuffled.slice(0, count);
}

export default function ConnectionsGame() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const username = searchParams.get("username") || "DiscordUser";

  const [chosenGroups] = useState(() => pickRandomGroups(CONNECTIONS_GROUPS, 4));
  const [grid] = useState(() => shuffle(chosenGroups.flatMap((g) => g.words)));
  const [selected, setSelected] = useState([]);
  const [solvedGroups, setSolvedGroups] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const maxAttempts = 4;

  function toggleWord(word) {
    if (gameOver) return;
    if (selected.includes(word)) {
      setSelected(selected.filter((w) => w !== word));
    } else if (selected.length < 4) {
      setSelected([...selected, word]);
    }
  }

  function checkGroup() {
    if (selected.length !== 4 || gameOver) return;

    const remainingGroups = chosenGroups.filter(
      (g) => !solvedGroups.some((sg) => sg.name === g.name)
    );

    const group = remainingGroups.find((g) => {
      const lowerSelected = selected.map((w) => w.toLowerCase()).sort();
      const lowerGroup = g.words.map((w) => w.toLowerCase()).sort();
      return lowerSelected.join(",") === lowerGroup.join(",");
    });

    if (group) {
      setSolvedGroups([...solvedGroups, group]);
      setSelected([]);
    } else {
      setMistakes(mistakes + 1);
      setSelected([]);
      if (mistakes + 1 >= maxAttempts) setGameOver(true);
    }
  }

  const allSolved = solvedGroups.length === chosenGroups.length;

  async function submitScore(success, attempts) {
    if (!userId) return;
    await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        username,
        game: "connections",
        score: success ? 1 : 0,
        attempts,
      }),
    });
  }

  useEffect(() => {
    if (allSolved || gameOver) {
      submitScore(allSolved, mistakes);
    }
  }, [allSolved, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Connections</h1>

      <div className="mb-4 text-xl font-semibold text-red-600">
        Mistakes: {mistakes} / {maxAttempts}
      </div>

      {solvedGroups.map((group) => (
        <div key={group.name} className="mb-4 w-full max-w-md">
          <p className="text-lg font-semibold text-green-700 mb-1">{group.name}</p>
          <div className="grid grid-cols-4 gap-3">
            {group.words.map((word) => (
              <div
                key={word}
                className="w-28 h-16 flex items-center justify-center font-bold rounded-lg shadow bg-green-500 text-white"
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="grid grid-cols-4 gap-3 mb-6">
        {grid
          .filter((word) => !solvedGroups.some((g) => g.words.includes(word)))
          .map((word) => {
            const isSelected = selected.includes(word);
            return (
              <button
                key={word}
                onClick={() => toggleWord(word)}
                disabled={gameOver}
                className={`w-28 h-16 flex items-center justify-center font-bold rounded-lg shadow
                  ${isSelected
                    ? "bg-blue-400 text-white"
                    : "bg-white text-gray-900 border-2 border-gray-300"
                  }`}
              >
                {word}
              </button>
            );
          })}
      </div>

      {!gameOver && !allSolved && (
        <button
          onClick={checkGroup}
          disabled={selected.length !== 4}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow disabled:opacity-50"
        >
          Submit Group
        </button>
      )}

      {allSolved && (
        <p className="mt-6 text-2xl font-semibold text-green-700">
          🎉 You solved all groups!
        </p>
      )}

      {gameOver && !allSolved && (
        <p className="mt-6 text-2xl font-semibold text-red-700">
          ❌ Game Over! You used all {maxAttempts} attempts.
        </p>
      )}
    </div>
  );
}