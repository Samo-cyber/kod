import Link from "next/link";
import { db } from "@/lib/db";
import LogoutButton from "@/components/Admin/LogoutButton";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getStories() {
    await db.connect();
    return db.getStories({ limit: 100 });
}

export default async function AdminDashboard() {
    const { data: stories } = await getStories();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-accent">إدارة القصص</h1>
                <div className="flex gap-4">
                    <LogoutButton />
                    <Link href="/admin/stories/new" className="bg-primary-2 text-secondary-3 px-6 py-2 rounded hover:bg-red-900 transition-colors">
                        إضافة قصة جديدة
                    </Link>
                </div>
            </div>

            <div className="bg-secondary-2 rounded-lg overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-primary-1 text-accent">
                        <tr>
                            <th className="p-4">العنوان</th>
                            <th className="p-4">الحالة</th>
                            <th className="p-4">تاريخ النشر</th>
                            <th className="p-4">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stories.map((story) => (
                            <tr key={story.id} className="border-t border-secondary-1 hover:bg-secondary-1/50">
                                <td className="p-4 font-bold">{story.title_ar}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${story.status === 'published' ? 'bg-green-900 text-green-100' :
                                        story.status === 'draft' ? 'bg-yellow-900 text-yellow-100' : 'bg-gray-700'
                                        }`}>
                                        {story.status === 'published' ? 'منشور' : story.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                                    </span>
                                </td>
                                <td className="p-4 opacity-70">{new Date(story.created_at).toLocaleDateString('ar-EG')}</td>
                                <td className="p-4 flex gap-2">
                                    <Link href={`/admin/stories/${story.id}/edit`} className="text-accent hover:underline">
                                        تعديل
                                    </Link>
                                    <button className="text-red-500 hover:underline">
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
