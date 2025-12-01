"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteSubmittedButton({ id }: { id: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("هل أنت متأكد من حذف هذه القصة المرسلة؟ لا يمكن التراجع عن هذا الإجراء.")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/submitted/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("فشل الحذف");
            }
        } catch (error) {
            console.error(error);
            alert("حدث خطأ");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 hover:underline whitespace-nowrap mr-4 disabled:opacity-50"
        >
            {isDeleting ? "جاري الحذف..." : "حذف"}
        </button>
    );
}
