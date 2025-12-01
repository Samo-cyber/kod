import Link from "next/link";
import { db } from "@/lib/db";
import DeleteSubmittedButton from "@/components/AdminUI/DeleteSubmittedButton.client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getSubmittedStories() {
    await db.connect();
    return db.getSubmittedStories();
}

export default async function SubmittedStoriesPage() {
    const stories = await getSubmittedStories();

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 md:gap-0">
                <h1 className="text-2xl md:text-3xl font-bold text-accent">القصص المرسلة</h1>
                <Link href="/admin" className="text-primary-2 hover:underline text-sm md:text-base">
                    عودة للوحة التحكم
                </Link>
            </div>

            <div className="bg-secondary-2 rounded-lg overflow-hidden shadow-lg">
                {stories.length === 0 ? (
                    <div className="p-8 text-center text-secondary-3">
                        لا توجد قصص مرسلة حالياً
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right min-w-[800px] md:min-w-full">
                            <thead className="bg-primary-1 text-accent">
                                <tr>
                                    <th className="p-3 md:p-4 whitespace-nowrap">العنوان</th>
                                    <th className="p-3 md:p-4 whitespace-nowrap">الكاتب</th>
                                    <th className="p-3 md:p-4 whitespace-nowrap">البريد</th>
                                    <th className="p-3 md:p-4 whitespace-nowrap">تاريخ الإرسال</th>
                                    <th className="p-3 md:p-4 whitespace-nowrap">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stories.map((story: any) => (
                                    <tr key={story.id} className="border-t border-secondary-1 hover:bg-secondary-1/50 transition-colors">
                                        <td className="p-3 md:p-4 font-bold">{story.title}</td>
                                        <td className="p-3 md:p-4">{story.author_name}</td>
                                        <td className="p-3 md:p-4 opacity-70">{story.email}</td>
                                        <td className="p-3 md:p-4 opacity-70 whitespace-nowrap">{new Date(story.created_at).toLocaleDateString('ar-EG')}</td>
                                        <td className="p-3 md:p-4">
                                            <div className="flex items-center gap-4">
                                                <Link href={`/admin/stories/new?from_submitted=${story.id}`} className="text-accent hover:underline whitespace-nowrap">
                                                    مراجعة ونشر
                                                </Link>
                                                <DeleteSubmittedButton id={story.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
