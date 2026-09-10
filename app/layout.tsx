import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const TITLE = "Escribile a tu representante sobre los riesgos de la IA";
const DESCRIPTION =
  "En menos de un minuto, mandale un mail a tus representantes políticos pidiendo que traten los riesgos del desarrollo acelerado de la inteligencia artificial. LatAm y España.";

// Cloudflare Web Analytics: gratis, sin cookies, ilimitado. El token sale del
// panel de Cloudflare después de crear el sitio; se pasa como env var al build.
const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14181f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        {CF_BEACON_TOKEN && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
          />
        )}
      </body>
    </html>
  );
}
