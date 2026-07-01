import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ["500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-rounded",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ねこエンジニア",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
  description:
    "IT・数学・ボルダリングが好きなエンジニアのハブページ。Zenn・note・同人誌・個人プロダクトへの導線。",
  openGraph: {
    title: "ねこエンジニア",
    description: "IT・数学・ボルダリングが好きなエンジニアのハブページ",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "ねこエンジニア",
    description: "IT・数学・ボルダリングが好きなエンジニアのハブページ",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${mPlusRounded.variable} ${notoSansJP.variable}`}
    >
      <body style={{ fontFamily: "var(--font-noto), sans-serif" }}>
        {children}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
