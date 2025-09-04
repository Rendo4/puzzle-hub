import { Suspense } from "react";
import ConnectionsGame from "./ConnectionsGame";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-xl">Loading Connections Game...</div>}>
      <ConnectionsGame />
    </Suspense>
  );
}
