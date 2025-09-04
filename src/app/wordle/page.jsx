import dynamic from "next/dynamic";

// Dynamically import the client-side ConnectionsGame component
const ConnectionsGame = dynamic(() => import("./ConnectionsGame"), { ssr: false });

export default function Page() {
  return <ConnectionsGame />;
}