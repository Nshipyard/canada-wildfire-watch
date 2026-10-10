import type { Metadata } from "next";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { LangProvider } from "@/i18n";
import { PosthogProvider } from "../components/PosthogProvider";

export const metadata: Metadata = {
  title: "Canada Wildfire Watch: live fires, burned-area history, fire weather",
  description:
    "Open-source wildfire intelligence for Canada. Live satellite hotspots and fire perimeters from Natural Resources Canada, 1972-2025 burned-area history from the National Burned Area Composite, and explainable fire-weather watch scores. English and French.",
  metadataBase: new URL("https://fire.canada.nshipyard.com"),
  openGraph: {
    title: "Canada Wildfire Watch",
    description:
      "Live Canadian wildfire perimeters and hotspots, 54 years of burned-area history, and fire-weather watch scores. Open data, open source.",
    type: "website",
    url: "https://fire.canada.nshipyard.com",
    images: [
      {
        url: "https://fire.canada.nshipyard.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Canada Wildfire Watch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canada Wildfire Watch",
    description:
      "Live Canadian wildfire perimeters and hotspots, 54 years of burned-area history, and fire-weather watch scores. Open data, open source.",
    images: ["https://fire.canada.nshipyard.com/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><PosthogProvider>
        <LangProvider>{children}</LangProvider>
      </PosthogProvider></body>
    </html>
  );
}
