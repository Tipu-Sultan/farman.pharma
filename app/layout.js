import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import ClientProvider from "./ClientProvide";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "D. Pharma Portfolio",
  description: "Professional portfolio for D. Pharma student",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />

            {children}
          </ThemeProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
