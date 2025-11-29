import "@/styles/globals.css";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Kingdom of Darkness | Admin",
    description: "Admin Dashboard",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-secondary-1 text-secondary-3 font-cairo" dir="rtl">
            <Link
                href="/"
                className="fixed bottom-8 left-8 z-50 bg-primary-2 text-secondary-3 px-6 py-3 rounded-full shadow-lg hover:bg-red-900 transition-all hover:scale-105 font-bold flex items-center gap-2"
            >
                <span>العودة للموقع</span>
                <span className="text-xl">&larr;</span>
            </Link>
            <main className="p-4">
                {children}
            </main>
        </div>
    );
}
