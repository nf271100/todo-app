import type { Metadata } from "next";
import Head from 'next/head'; // Importing Head for Google Font
import localFont from "next/font/local";
import "./globals.css";

// Custom local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the app
export const metadata: Metadata = {
  title: "To-Do List App",
  description: "A simple and stylish To-Do list app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {/* Adding Google Font (Poppins) */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-poppins`} // Applying both local and Google fonts
        style={{
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", // Gradient background
          minHeight: "100vh", // Full viewport height
          display: "flex", // Flex to center content
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          padding: "2rem", // Add some padding
        }}
      >
        <main
          style={{
            background: "white", // Main content background
            borderRadius: "12px", // Rounded corners
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
            maxWidth: "1000px", // Maximum width for large screens
            width: "100%", // Full width on smaller screens
            padding: "3rem", // Padding inside the main content
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
