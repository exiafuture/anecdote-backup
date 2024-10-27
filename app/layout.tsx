import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "./components/navbar";
import ThemeProviderWrapper from "./context/themeWrapper";
import { AuthProvider } from "./context/authContext";
import Footer from "./components/footer";

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

export const metadata: Metadata = {
  title: "Anecdote",
  description: "An automated clerk for your inventories",
  icons: {
    icon: "/images/favicon.ico"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProviderWrapper>
            <NavBar />
            {children}
            <Footer />
          </ThemeProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
