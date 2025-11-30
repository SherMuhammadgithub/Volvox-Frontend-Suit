import { Fira_Code as FontMono } from "next/font/google";
import { Poppins as FontSans } from "next/font/google";
export const fontSans = FontSans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
