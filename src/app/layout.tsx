import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "文豪 AI",
  description: "一个具有Apple设计风格的AI聊天应用",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        {children}
      </body>
    </html>
  );
}
