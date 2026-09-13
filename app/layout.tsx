import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AQORIA Reply",
  description: "問い合わせの整理・優先順位付け・返信案作成を支援する営業デモ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
