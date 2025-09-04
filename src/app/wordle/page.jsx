import dynamic from "next/dynamic";

// Dynamically import the client-side Wordle game
const WordleGame = dynamic(() => import("./WordleGame"), { ssr: false });

export default function Page() {
  return <WordleGame />;
}