import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let content = body.content;
    if (body.cover_image) {
      content = `![Cover Image](${body.cover_image})\n\n${content}`;
    }

    await db.connect();
    const story = await db.createSubmittedStory({
      title: body.title,
      author_name: body.author,
      email: body.email,
      content: content
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
