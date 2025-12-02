"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
    id: string;
    content: string;
    author_name: string;
    created_at: string;
}

interface CommentsSectionProps {
    storyId: string;
}

export default function CommentsSection({ storyId }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchComments = async (pageNum: number, reset = false) => {
        try {
            const res = await fetch(`/api/stories/${storyId}/comments?page=${pageNum}`);
            const data = await res.json();

            if (data.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (reset) {
                setComments(data);
            } else {
                setComments((prev) => [...prev, ...data]);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(1, true);
    }, [storyId]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchComments(nextPage);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/stories/${storyId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: newComment,
                    author_name: authorName || "مجهول",
                }),
            });

            if (res.ok) {
                setNewComment("");
                setPage(1);
                fetchComments(1, true); // Refresh list
            } else {
                const err = await res.json();
                alert(err.error || "Failed to post comment");
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-12 border-t border-secondary-2 pt-8">
            <h3 className="text-2xl font-cairo font-bold text-accent mb-6">التعليقات ({comments.length}{hasMore ? "+" : ""})</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8 bg-secondary-1 p-6 rounded-lg border border-secondary-2">
                <div className="mb-4">
                    <label className="block text-secondary-3 text-sm mb-2 font-cairo">الاسم (اختياري)</label>
                    <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="اكتب اسمك هنا..."
                        maxLength={50}
                        className="w-full bg-primary-1 border border-secondary-2 rounded p-3 text-secondary-3 focus:border-accent focus:outline-none transition-colors"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-secondary-3 text-sm mb-2 font-cairo">تعليقك</label>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="شاركنا رأيك في القصة..."
                        rows={4}
                        required
                        maxLength={500}
                        className="w-full bg-primary-1 border border-secondary-2 rounded p-3 text-secondary-3 focus:border-accent focus:outline-none transition-colors resize-none"
                    />
                    <div className="text-left text-xs text-secondary-3 opacity-50 mt-1">
                        {newComment.length}/500
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary-2 text-secondary-3 px-6 py-2 rounded font-bold hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? "جاري النشر..." : "نشر التعليق"}
                </button>
            </form>

            {/* Comments List */}
            {loading && page === 1 ? (
                <div className="text-center text-secondary-3 opacity-50 py-8">جاري تحميل التعليقات...</div>
            ) : comments.length === 0 ? (
                <div className="text-center text-secondary-3 opacity-50 py-8">كن أول من يعلق على هذه القصة!</div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {comments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-secondary-1/50 p-4 rounded border border-secondary-2/50"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-accent font-cairo">{comment.author_name}</span>
                                    <span className="text-xs text-secondary-3 opacity-50">
                                        {new Date(comment.created_at).toLocaleDateString('ar-EG')}
                                    </span>
                                </div>
                                <p className="text-secondary-3 leading-relaxed">{comment.content}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {hasMore && (
                        <div className="text-center mt-6">
                            <button
                                onClick={handleLoadMore}
                                className="text-accent hover:text-secondary-3 transition-colors text-sm font-bold border-b border-accent hover:border-secondary-3 pb-1"
                            >
                                تحميل المزيد من التعليقات
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
