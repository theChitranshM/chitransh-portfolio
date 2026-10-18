import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/siteUrl";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: "500", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.seo.title,
  description: site.seo.description,
  applicationName: "dialed in",
  authors: [{ name: site.name, url: siteUrl }],
  openGraph: {
    type: "website",
    title: site.seo.title,
    description: site.seo.description,
    url: siteUrl,
    siteName: site.name,
    locale: "en_CA",
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#140D09",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: siteUrl,
  jobTitle: "Data & AI Consultant",
  worksFor: { "@type": "Organization", name: "Insight" },
  alumniOf: { "@type": "CollegeOrUniversity", name: site.education.school },
  address: { "@type": "PostalAddress", addressLocality: "Vancouver", addressRegion: "BC", addressCountry: "CA" },
  email: `mailto:${site.links.email}`,
  sameAs: [site.links.github, site.links.instagram, site.links.linkedin],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${caveat.variable} antialiased`}
    >
      <body>
        <a
          href="/recruiter"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-agent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-espresso"
        >
          skip to recruiter mode
        </a>
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<style>.js-only{display:none!important}</style><p style="position:fixed;bottom:12px;left:12px;right:12px;z-index:60;padding:10px 14px;border-radius:12px;background:#140D09;color:#E9C9A1;font:13px ui-monospace,monospace">javascript is off, so no 3D tonight. <a href="/recruiter" style="color:#9CFF6E">recruiter mode</a> works great without it.</p>',
          }}
        />
        {children}
        <div className="grain" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Analytics />
      </body>
    </html>
  );
}
