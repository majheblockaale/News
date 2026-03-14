import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NewsletterPopup } from "@/components/ui/NewsletterPopup";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://newssite.com"),
  title: {
    default: "NewsSite — Breaking News, Analysis & In-Depth Reporting",
    template: "%s | NewsSite",
  },
  description:
    "Your trusted source for breaking news, expert analysis, and in-depth reporting across technology, business, science, health, sports, and entertainment.",
  keywords: [
    "news",
    "breaking news",
    "technology news",
    "business news",
    "science news",
    "latest news",
  ],
  openGraph: {
    type: "website",
    siteName: "NewsSite",
    title: "NewsSite — Breaking News, Analysis & In-Depth Reporting",
    description:
      "Your trusted source for breaking news, expert analysis, and in-depth reporting.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewsSite — Breaking News, Analysis & In-Depth Reporting",
    description:
      "Your trusted source for breaking news, expert analysis, and in-depth reporting.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
  },
  alternates: {
    canonical: "https://newssite.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="news_keywords" content="breaking news, latest news, technology, business" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NewsSite" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <NewsletterPopup />
        </ThemeProvider>
      </body>
    </html>
  );
}
