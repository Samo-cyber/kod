import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await db.connect();
    const story = await db.createStory({
      title_ar: body.title, // Assuming frontend sends 'title'
      body_markdown_ar: body.content, // Assuming frontend sends 'content'
      body_html_ar: body.content, // Simple fallback
      excerpt_ar: body.content.substring(0, 100) + "...",
      slug: `submitted-${Date.now()}`,
      status: "pending",
      cover_image: "/images/placeholders/story-placeholder.svg", // Default placeholder
      author_id: null
    });

    return NextResponse.json({
      success: true,
      message: "Story received",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
