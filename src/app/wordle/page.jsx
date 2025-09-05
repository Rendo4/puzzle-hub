import { Suspense } from "react";
import WordleGame from "./WordleGame";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Wordle...</div>}>
      <WordleGame />
    </Suspense>
  );
}
