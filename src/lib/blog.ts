import fs from "node:fs";
import path from "node:path";

export interface BlogArticleMeta {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  category: string;
  tags: string[];
  coverLabel: string;
  coverHighlight: string;
  seoDescription: string;
  status: "published" | "draft";
  editorialNotice: string;
  readingTimeMinutes: number;
}

export interface BlogArticle extends BlogArticleMeta {
  content: string;
}

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function parseFrontmatter(rawFile: string): {
  data: Record<string, string | string[]>;
  content: string;
} {
  const normalized = rawFile.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return { data: {}, content: normalized };
  }

  const endMarker = normalized.indexOf("\n---\n", 4);
  if (endMarker === -1) {
    return { data: {}, content: normalized };
  }

  const yamlBlock = normalized.slice(4, endMarker);
  const content = normalized.slice(endMarker + 5).trim();
  const data: Record<string, string | string[]> = {};

  for (const line of yamlBlock.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let rawVal = trimmed.slice(colonIdx + 1).trim();

    if (rawVal.startsWith("[") && rawVal.endsWith("]")) {
      const inner = rawVal.slice(1, -1).trim();
      data[key] = inner
        ? inner
            .split(",")
            .map((s) => s.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean)
        : [];
    } else {
      rawVal = rawVal.replace(/^["']|["']$/g, "");
      data[key] = rawVal;
    }
  }

  return { data, content };
}

export function calculateReadingTimeMinutes(text: string): number {
  const words = text
    .replace(/[#*`>\-_]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function parseArticleFile(filePath: string): BlogArticle | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = parseFrontmatter(raw);

    const status =
      String(data.status || "draft").toLowerCase() === "published"
        ? "published"
        : "draft";

    const slug =
      String(data.slug || path.basename(filePath, ".md")).trim();
    const title = String(data.title || slug).trim();
    const excerpt = String(data.excerpt || "").trim();
    const author = String(data.author || "Aobakwe Dipitso").trim();
    const authorRole = String(
      data.authorRole || "Founder & Director, Plethora (Pty) Ltd"
    ).trim();
    const publishedAt = String(data.publishedAt || "2026-10-11").trim();
    const category = String(data.category || "Operations").trim();
    const tags = Array.isArray(data.tags)
      ? data.tags
      : String(data.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
    const coverLabel = String(data.coverLabel || category).trim();
    const coverHighlight = String(
      data.coverHighlight || "Connected security workforce operations"
    ).trim();
    const seoDescription = String(data.seoDescription || excerpt).trim();
    const editorialNotice = String(
      data.editorialNotice || "Editorial draft — pending final review"
    ).trim();

    return {
      title,
      slug,
      excerpt,
      author,
      authorRole,
      publishedAt,
      category,
      tags,
      coverLabel,
      coverHighlight,
      seoDescription,
      status,
      editorialNotice,
      readingTimeMinutes: calculateReadingTimeMinutes(content),
      content,
    };
  } catch {
    return null;
  }
}

export function getAllArticles(options?: {
  includeDrafts?: boolean;
}): BlogArticle[] {
  const includeDrafts = options?.includeDrafts === true;
  if (!fs.existsSync(BLOG_CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter((file) => file.endsWith(".md"));

  const articles = files
    .map((file) => parseArticleFile(path.join(BLOG_CONTENT_DIR, file)))
    .filter((a): a is BlogArticle => a !== null)
    .filter((a) => (includeDrafts ? true : a.status === "published"));

  return articles.sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
}

export function getPublishedArticles(): BlogArticle[] {
  return getAllArticles({ includeDrafts: false });
}

export function getPublishedArticleBySlug(slug: string): BlogArticle | null {
  const normalizedSlug = slug.trim().toLowerCase();
  const articles = getPublishedArticles();
  return (
    articles.find((a) => a.slug.toLowerCase() === normalizedSlug) || null
  );
}

export function getRelatedArticles(
  currentSlug: string,
  limit = 2
): BlogArticle[] {
  const all = getPublishedArticles();
  const current = all.find((a) => a.slug === currentSlug);
  const others = all.filter((a) => a.slug !== currentSlug);

  if (!current) return others.slice(0, limit);

  const scored = others.map((candidate) => {
    let score = 0;
    if (candidate.category === current.category) score += 2;
    for (const tag of candidate.tags) {
      if (current.tags.includes(tag)) score += 1;
    }
    return { candidate, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.candidate);
}

export function getAllCategories(): string[] {
  const articles = getPublishedArticles();
  return Array.from(new Set(articles.map((a) => a.category)));
}

export function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

export function getAdminArticleBySlug(slug: string): BlogArticle | null {
  const normalizedSlug = sanitizeSlug(slug);
  const articles = getAllArticles({ includeDrafts: true });
  return (
    articles.find((a) => a.slug.toLowerCase() === normalizedSlug) || null
  );
}

function escapeYamlString(val: string): string {
  const clean = val.replace(/\r?\n/g, " ").replace(/"/g, '\\"').trim();
  return `"${clean}"`;
}

export interface SaveBlogArticleInput {
  originalSlug?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  author?: string;
  authorRole?: string;
  publishedAt?: string;
  category?: string;
  tags?: string[] | string;
  coverLabel?: string;
  coverHighlight?: string;
  seoDescription?: string;
  status?: "published" | "draft";
  editorialNotice?: string;
  content: string;
}

export function saveBlogArticle(input: SaveBlogArticleInput): BlogArticle {
  fs.mkdirSync(BLOG_CONTENT_DIR, { recursive: true });

  const slug = sanitizeSlug(input.slug || input.title || "untitled-article");
  if (!slug) {
    throw new Error("A valid article slug or title is required.");
  }

  const title = (input.title || slug).trim();
  const excerpt = (
    input.excerpt ||
    input.content.replace(/[#*`>\-_]/g, "").trim().slice(0, 180)
  ).trim();
  const author = (input.author || "Aobakwe Dipitso").trim();
  const authorRole = (
    input.authorRole || "Founder & Director, Plethora (Pty) Ltd"
  ).trim();
  const publishedAt = (
    input.publishedAt || new Date().toISOString().slice(0, 10)
  ).trim();
  const category = (input.category || "Operations").trim();

  const parsedTags = Array.isArray(input.tags)
    ? input.tags.map((t) => String(t).trim()).filter(Boolean)
    : String(input.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

  const tags = parsedTags.length > 0 ? parsedTags : [category];
  const coverLabel = (input.coverLabel || `${category} Brief`).trim();
  const coverHighlight = (
    input.coverHighlight || title.slice(0, 80)
  ).trim();
  const seoDescription = (input.seoDescription || excerpt).trim();
  const status: "published" | "draft" =
    input.status === "published" ? "published" : "draft";
  const editorialNotice = (
    input.editorialNotice || "Editorial draft — pending final review"
  ).trim();
  const content = (input.content || "").replace(/\r\n/g, "\n").trim();

  const yamlLines = [
    "---",
    `title: ${escapeYamlString(title)}`,
    `slug: ${escapeYamlString(slug)}`,
    `excerpt: ${escapeYamlString(excerpt)}`,
    `author: ${escapeYamlString(author)}`,
    `authorRole: ${escapeYamlString(authorRole)}`,
    `publishedAt: ${escapeYamlString(publishedAt)}`,
    `category: ${escapeYamlString(category)}`,
    `tags: [${tags.map((t) => escapeYamlString(t)).join(", ")}]`,
    `coverLabel: ${escapeYamlString(coverLabel)}`,
    `coverHighlight: ${escapeYamlString(coverHighlight)}`,
    `seoDescription: ${escapeYamlString(seoDescription)}`,
    `status: ${escapeYamlString(status)}`,
    `editorialNotice: ${escapeYamlString(editorialNotice)}`,
    "---",
    "",
    content,
    "",
  ];

  // If the slug was renamed, remove the old markdown file if it existed
  if (input.originalSlug) {
    const oldSlug = sanitizeSlug(input.originalSlug);
    if (oldSlug && oldSlug !== slug) {
      const oldPath = path.join(BLOG_CONTENT_DIR, `${oldSlug}.md`);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
  }

  const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, yamlLines.join("\n"), "utf-8");

  return {
    title,
    slug,
    excerpt,
    author,
    authorRole,
    publishedAt,
    category,
    tags,
    coverLabel,
    coverHighlight,
    seoDescription,
    status,
    editorialNotice,
    readingTimeMinutes: calculateReadingTimeMinutes(content),
    content,
  };
}

export function deleteBlogArticle(slug: string): boolean {
  const safeSlug = sanitizeSlug(slug);
  if (!safeSlug) return false;
  const filePath = path.join(BLOG_CONTENT_DIR, `${safeSlug}.md`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}
