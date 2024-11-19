import type { Metadata } from "next";
import "./globals.css";
import { roboto } from "@/ui/fonts";
import MainDrawer from "@/components/MainDrawer";

export const metadata: Metadata = {
  title: "Safranit",
  description: "a book catalog site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <MainDrawer>
        {children}
        </MainDrawer>
        </body>
    </html>
  );
}
