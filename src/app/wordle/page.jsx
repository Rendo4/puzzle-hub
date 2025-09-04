import { Suspense } from "react";
import WordleGame from "./WordleGame";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-xl">Loading Wordle Game...</div>}>
      <WordleGame />
    </Suspense>
  );
}