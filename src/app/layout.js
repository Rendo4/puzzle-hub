import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Puzzle Hub",
  description: "Wordle + Connections",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}