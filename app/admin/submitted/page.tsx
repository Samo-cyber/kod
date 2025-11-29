import Link from "next/link";
import { db } from "@/lib/db";

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
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-accent">القصص المرسلة</h1>
                <Link href="/admin" className="text-primary-2 hover:underline">
                    عودة للوحة التحكم
                </Link>
            </div>

            <div className="bg-secondary-2 rounded-lg overflow-hidden">
                {stories.length === 0 ? (
                    <div className="p-8 text-center text-secondary-3">
                        لا توجد قصص مرسلة حالياً
                    </div>
                ) : (
                    <table className="w-full text-right">
                        <thead className="bg-primary-1 text-accent">
                            <tr>
                                <th className="p-4">العنوان</th>
                                <th className="p-4">الكاتب</th>
                                <th className="p-4">البريد</th>
                                <th className="p-4">تاريخ الإرسال</th>
                                <th className="p-4">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stories.map((story: any) => (
                                <tr key={story.id} className="border-t border-secondary-1 hover:bg-secondary-1/50">
                                    <td className="p-4 font-bold">{story.title}</td>
                                    <td className="p-4">{story.author_name}</td>
                                    <td className="p-4 opacity-70">{story.email}</td>
                                    <td className="p-4 opacity-70">{new Date(story.created_at).toLocaleDateString('ar-EG')}</td>
                                    <td className="p-4 flex gap-2">
                                        <Link href={`/admin/stories/new?from_submitted=${story.id}`} className="text-accent hover:underline">
                                            مراجعة ونشر
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
