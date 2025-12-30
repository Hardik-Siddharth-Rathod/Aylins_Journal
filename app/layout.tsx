import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jenny’s Space 🤍",
  description: "A private space filled with words written for Aylin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>

     <body
  style={{
    margin: 0,
    fontFamily: "'Playfair Display', Georgia, serif",
    backgroundColor: "#faf9f7",
    color: "#2b2b2b",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    overflowX: "hidden",
  }}
>

        {children}
      </body>
    </html>
  );
}

