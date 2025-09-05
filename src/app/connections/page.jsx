import { Suspense } from "react";
import dynamic from "next/dynamic";

const ConnectionsGame = dynamic(() => import("./ConnectionsGame"), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Connections...</div>}>
      <ConnectionsGame />
    </Suspense>
  );
}
