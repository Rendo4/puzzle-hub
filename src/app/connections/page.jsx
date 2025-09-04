"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ConnectionsGame = dynamic(() => import("./ConnectionsGame"), { ssr: false });

export default function Page() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const username = searchParams.get("username");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConnectionsGame userId={userId} username={username} />
    </Suspense>
  );
}