"use client"; 

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome to Puzzle Hub!</h1>
      <p>Use /wordle or /connections to start playing!</p>
    </div>
  );
}