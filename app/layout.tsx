import type { Metadata } from "next";
import { Cairo, Changa, Bebas_Neue, Inter, Montserrat } from "next/font/google";
import "@/styles/globals.css";
import clsx from "clsx";
import AudioManager from "@/components/Audio/AudioManager";
import WelcomeOverlay from "@/components/Landing/WelcomeOverlay";
import DisableRightClick from "@/components/DisableRightClick.client";


const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", weight: ["500", "900"] });
const changa = Changa({ subsets: ["arabic", "latin"], variable: "--font-changa", weight: ["600"] });
const bebas = Bebas_Neue({ subsets: ["latin"], variable: "--font-bebas", weight: ["400"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400"] });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["400", "600"] });

export const metadata: Metadata = {
    title: "Kingdom of Darkness | مملكة الظلام",
    description: "Tales that cross the line between reality and nightmares. حكايات تتجاوز الخط الفاصل بين الواقع والكوابيس.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl">
            <body className={clsx(
                cairo.variable,
                changa.variable,
                bebas.variable,
                inter.variable,
                montserrat.variable,
                "font-cairo antialiased"
            )}>
                <WelcomeOverlay />
                <AudioManager />
                <DisableRightClick />
                {children}
            </body>
        </html>
    );
}
