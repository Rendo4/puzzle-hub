"use client";

import Link from "next/link";

//adding this text to update filename
export default function Navbar() {
  return (
    <nav className="w-full bg-gray-800 text-white px-6 py-3 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Puzzle Hub</h1>
      <div className="flex space-x-6">
        <Link href="/wordle" className="hover:text-yellow-400">
          Wordle
        </Link>
        <Link href="/connections" className="hover:text-yellow-400">
          Connections
        </Link>
      </div>
    </nav>
  );
}