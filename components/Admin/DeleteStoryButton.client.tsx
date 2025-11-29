"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteStoryButton({ id }: { id: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("هل أنت متأكد من حذف هذه القصة؟ لا يمكن التراجع عن هذا الإجراء.")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/stories/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("حدث خطأ أثناء الحذف");
            }
        } catch (error) {
            console.error(error);
            alert("حدث خطأ في الاتصال");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:underline disabled:opacity-50"
        >
            {isDeleting ? "جاري الحذف..." : "حذف"}
        </button>
    );
}
