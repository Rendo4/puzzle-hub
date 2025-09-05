import { Suspense } from "react";
import ConnectionsGame from "./ConnectionsGame";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Connections...</div>}>
      <ConnectionsGame />
    </Suspense>
  );
}
