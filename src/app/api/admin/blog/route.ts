import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import {
  deleteBlogArticle,
  getAllArticles,
  saveBlogArticle,
  SaveBlogArticleInput,
} from "@/lib/blog";

export async function GET() {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    articles: getAllArticles({ includeDrafts: true }),
  });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as SaveBlogArticleInput;
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { ok: false, message: "Article title is required." },
        { status: 400 }
      );
    }
    if (!body.content || !body.content.trim()) {
      return NextResponse.json(
        { ok: false, message: "Article Markdown content is required." },
        { status: 400 }
      );
    }

    const saved = saveBlogArticle(body);
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${saved.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({
      ok: true,
      article: saved,
      articles: getAllArticles({ includeDrafts: true }),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        message:
          err instanceof Error ? err.message : "Failed to save blog article.",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { ok: false, message: "Missing slug query parameter." },
      { status: 400 }
    );
  }

  const deleted = deleteBlogArticle(slug);
  if (deleted) {
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
  }

  return NextResponse.json({
    ok: deleted,
    articles: getAllArticles({ includeDrafts: true }),
  });
}
