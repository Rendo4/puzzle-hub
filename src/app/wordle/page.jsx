import { Suspense } from "react";
import dynamic from "next/dynamic";

const WordleGame = dynamic(() => import("./WordleGame"), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Wordle...</div>}>
      <WordleGame />
    </Suspense>
  );
}
