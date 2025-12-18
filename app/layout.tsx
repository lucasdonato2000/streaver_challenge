import "./globals.css";
import Link from "next/link";
import { QueryProvider } from "../lib/query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-navy-700 text-light min-h-screen">
        <QueryProvider>
          <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-border/50 shadow-lg">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <Link href="/posts" className="flex items-center gap-3 group">
           
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-light group-hover:text-accent transition-colors">
                      Streaver Challenge
                    </span>
                    <span className="text-xs text-muted">Community Posts</span>
                  </div>
                </Link>

                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg">
                    <span className="text-sm text-accent font-medium">Posts Feed</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="min-h-[calc(100vh-73px)]">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
