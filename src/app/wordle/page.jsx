import { Suspense } from "react";
import WordleGame from "./WordleGame";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading Wordle...</p>}>
      <WordleGame />
    </Suspense>
  );
}