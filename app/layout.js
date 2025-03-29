// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import ClientProvider from "./ClientProvide";
import MobileNav from "@/components/MobileNav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "D. Pharma Portfolio",
  description: "Professional portfolio for D. Pharma student",
};

export default function RootLayout({ children }) {
  const isAdminRoute = children?.props?.childProp?.segment?.startsWith('admin') || false;

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
            <Toaster/>
            {!isAdminRoute && <Navbar />}
            <div className={isAdminRoute ? "" : "pt-16 pb-16"}> {/* Add padding-top for non-admin routes */}
              {children}
            </div>
            {!isAdminRoute && <MobileNav />}
          </ThemeProvider>
        </ClientProvider>
      </body>
    </html>
  );
}