import { Suspense } from "react";
import ConnectionsGame from "./ConnectionsGame";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading Connections Game...</p>}>
      <ConnectionsGame />
    </Suspense>
  );
}