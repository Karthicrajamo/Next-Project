import "./globals.css";

export const metadata = {
  title: "AI Evolution Timeline",
  description: "Interactive timeline of AI development",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
