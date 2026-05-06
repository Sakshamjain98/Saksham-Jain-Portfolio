import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { ThemeProvider } from "./provider";

const dmSans = localFont({
  src: [
    {
      path: "../public/fonts/DM_Sans/DMSans-VariableFont_opsz,wght.ttf",
      weight: "100 1000",
      style: "normal",
    },
    {
      path: "../public/fonts/DM_Sans/DMSans-Italic-VariableFont_opsz,wght.ttf",
      weight: "100 1000",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-dm-sans",
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sakshamjain.codes";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Saksham Jain — Full-Stack Engineer & Systems Architect",
    template: "%s · Saksham Jain",
  },
  description:
    "Saksham Jain — senior-track full-stack engineer and systems architect. PRD-to-production ownership, backend depth, AI infrastructure, and CMS platforms. Eight live sub-products on sakshamjain.codes.",
  keywords: [
    "Saksham Jain",
    "Full-Stack Engineer",
    "Systems Architect",
    "Backend Engineer",
    "Next.js",
    "TypeScript",
    "MongoDB",
    "Product Engineer",
    "AI Infrastructure",
    "India",
  ],
  authors: [{ name: "Saksham Jain", url: siteUrl }],
  creator: "Saksham Jain",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Saksham Jain — Full-Stack Engineer & Systems Architect",
    description:
      "Senior-track engineer building production systems with architecture-first thinking. Eight live sub-products. Available for senior IC and founding-engineer roles.",
    siteName: "Saksham Jain",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saksham Jain — Full-Stack Engineer & Systems Architect",
    description:
      "Senior-track engineer building production systems. PRD → HLD → ship → operate.",
    creator: "@Saksham_Jain007",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000319" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={dmSans.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
