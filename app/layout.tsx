import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { sv } from "@/lib/copy/sv";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const heading = Fraunces({ variable: "--font-heading", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: sv.site.name, template: `%s · ${sv.site.name}` },
  description: sv.site.description,
  applicationName: sv.site.name,
  appleWebApp: { capable: true, title: "Skafferiet", statusBarStyle: "default" },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    siteName: sv.site.name,
    images: ["/icons/icon-512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#2f5a3e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sv" className={`${sans.variable} ${heading.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
