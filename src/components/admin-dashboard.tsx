"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Inbox,
  Mail,
  FileText,
  Settings,
  LayoutDashboard,
  RefreshCw,
  LogOut,
  ExternalLink,
  Download,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Edit3,
  Eye,
  Send,
  Lock,
  AlertCircle,
  Save,
  ArrowUpRight,
  KeyRound,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { MarkdownContent } from "@/components/markdown-content";
import type {
  DemoEnquiryRecord,
  DemoEnquiryStatus,
  SubscriptionRecord,
  SubscriptionStatus,
} from "@/lib/submissions";
import type { BlogArticle } from "@/lib/blog";
import type { DynamicSiteSettings } from "@/lib/site-settings";
import type { AdminSecurityInfo } from "@/lib/admin-auth";

interface AdminLoginProps {
  usingDefaultPassword: boolean;
}

export function AdminLoginScreen({ usingDefaultPassword }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setError(data.message || "Invalid password.");
        setLoading(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Network error while signing in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#f7f6f2] flex flex-col justify-between">
      {/* Top Bar */}
      <div className="border-b border-[#e4e4e4] bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo variant="primary" height={24} />
            <span className="rounded bg-[#f7f6f2] border border-[#e4e4e4] px-2.5 py-0.5 font-mono text-xs text-zinc-700">
              Admin Console
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-black"
          >
            <span>Return to public website</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Login Card */}
      <div className="mx-auto w-full max-w-md px-4 py-12">
        <div className="rounded-2xl border border-[#d0ceca] bg-white p-6 sm:p-8 shadow-xs">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3eb] border border-[#fcb488] text-[#c04900]">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>

          <h1 className="font-heading mt-4 text-2xl font-medium text-black">
            Website &amp; Communications Admin
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600">
            Sign in to read demo enquiries, manage email subscribers, publish blog articles, and update website settings.
          </p>

          {usingDefaultPassword && (
            <div className="mt-4 rounded-xl border border-[#fcb488] bg-[#fff3eb] p-3.5 text-xs leading-relaxed text-zinc-800">
              <p className="font-medium text-black">
                Local Development Credential Active
              </p>
              <p className="mt-1">
                Default password:{" "}
                <code className="rounded bg-white px-1.5 py-0.5 font-mono font-medium text-[#c04900] border border-[#fcb488]">
                  plethora-admin-2026
                </code>
              </p>
              <p className="mt-1 text-[11px] text-zinc-600">
                You can change this password directly inside{" "}
                <strong>Website Settings → Security &amp; Access</strong> after signing in.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-medium text-black"
              >
                Administrator Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="mt-1.5 w-full rounded-lg border border-[#d0ceca] bg-white px-3.5 py-2.5 text-base text-black placeholder:text-zinc-400 focus:border-[#ff6e14] focus:outline-none"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-[#f63232]/40 bg-[#f63232]/10 p-3 text-xs text-black"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-[#f63232] mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[46px] rounded-lg bg-[#ff6e14] px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#fcb488] disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign in to Admin Console"}
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-[#e4e4e4] bg-white px-4 py-4 text-center text-xs text-zinc-500">
        Plethora (Pty) Ltd · Internal Website Management Portal
      </div>
    </div>
  );
}

interface AdminDashboardProps {
  initialDemoEnquiries: DemoEnquiryRecord[];
  initialSubscriptions: SubscriptionRecord[];
  initialArticles: BlogArticle[];
  initialSettings: DynamicSiteSettings;
  initialSecurityInfo: AdminSecurityInfo;
  usingDefaultPassword: boolean;
}

type AdminTab = "overview" | "enquiries" | "subscribers" | "blog" | "settings";

const STATUS_LABELS: Record<DemoEnquiryStatus, string> = {
  new: "New Enquiry",
  contacted: "Contacted",
  pilot_scoped: "Pilot Scoped",
  archived: "Archived",
};

const STATUS_STYLES: Record<DemoEnquiryStatus, string> = {
  new: "bg-[#ff6e14] text-black font-medium",
  contacted: "bg-[#f4a834]/25 text-black border border-[#f4a834]",
  pilot_scoped: "bg-[#5ad824]/20 text-black border border-[#5ad824]",
  archived: "bg-zinc-200 text-zinc-700",
};

export function AdminDashboard({
  initialDemoEnquiries,
  initialSubscriptions,
  initialArticles,
  initialSettings,
  initialSecurityInfo,
  usingDefaultPassword,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [demoEnquiries, setDemoEnquiries] =
    useState<DemoEnquiryRecord[]>(initialDemoEnquiries);
  const [subscriptions, setSubscriptions] =
    useState<SubscriptionRecord[]>(initialSubscriptions);
  const [articles, setArticles] = useState<BlogArticle[]>(initialArticles);
  const [settings, setSettings] =
    useState<DynamicSiteSettings>(initialSettings);
  const [securityInfo, setSecurityInfo] =
    useState<AdminSecurityInfo>(initialSecurityInfo);

  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Demo Enquiries filter & selection state
  const [enquirySearch, setEnquirySearch] = useState("");
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<
    "all" | DemoEnquiryStatus
  >("all");
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(
    initialDemoEnquiries[0]?.id || null
  );
  const [noteDraft, setNoteDraft] = useState<string>(
    initialDemoEnquiries[0]?.internalNotes || ""
  );
  const [savingEnquiryId, setSavingEnquiryId] = useState<string | null>(null);

  // Subscribers filter state
  const [subSearch, setSubSearch] = useState("");
  const [subStatusFilter, setSubStatusFilter] = useState<
    "all" | SubscriptionStatus
  >("all");

  // Blog Editor state
  const [editingArticle, setEditingArticle] = useState<{
    originalSlug?: string;
    title: string;
    slug: string;
    excerpt: string;
    author: string;
    authorRole: string;
    publishedAt: string;
    category: string;
    tags: string;
    coverLabel: string;
    coverHighlight: string;
    seoDescription: string;
    status: "published" | "draft";
    editorialNotice: string;
    content: string;
  } | null>(null);
  const [blogPreviewMode, setBlogPreviewMode] = useState(false);
  const [savingBlog, setSavingBlog] = useState(false);

  // Settings & Password state
  const [savingSettings, setSavingSettings] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [revokingSessions, setRevokingSessions] = useState(false);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  }

  async function refreshAllData() {
    setRefreshing(true);
    try {
      const [subRes, blogRes, setRes] = await Promise.all([
        fetch("/api/admin/submissions"),
        fetch("/api/admin/blog"),
        fetch("/api/admin/settings"),
      ]);
      if (subRes.ok) {
        const subData = await subRes.json();
        setDemoEnquiries(subData.demoEnquiries || []);
        setSubscriptions(subData.subscriptions || []);
      }
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        setArticles(blogData.articles || []);
      }
      if (setRes.ok) {
        const setData = await setRes.json();
        if (setData.settings) setSettings(setData.settings);
      }
      showToast("Data synced with server storage.");
    } catch {
      showToast("Could not refresh data.");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.reload();
  }

  // Filtered Demo Enquiries
  const filteredEnquiries = useMemo(() => {
    return demoEnquiries.filter((item) => {
      if (
        enquiryStatusFilter !== "all" &&
        item.status !== enquiryStatusFilter
      ) {
        return false;
      }
      if (!enquirySearch.trim()) return true;
      const q = enquirySearch.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.operationalFocus.toLowerCase().includes(q)
      );
    });
  }, [demoEnquiries, enquiryStatusFilter, enquirySearch]);

  const selectedEnquiry = useMemo(() => {
    return (
      demoEnquiries.find((e) => e.id === selectedEnquiryId) ||
      filteredEnquiries[0] ||
      null
    );
  }, [demoEnquiries, selectedEnquiryId, filteredEnquiries]);

  function selectEnquiry(item: DemoEnquiryRecord) {
    setSelectedEnquiryId(item.id);
    setNoteDraft(item.internalNotes || "");
  }

  async function handleUpdateEnquiry(
    id: string,
    patch: { status?: DemoEnquiryStatus; internalNotes?: string }
  ) {
    setSavingEnquiryId(id);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "demo", id, ...patch }),
      });
      const data = await res.json();
      if (res.ok && data.record) {
        setDemoEnquiries((prev) =>
          prev.map((item) => (item.id === id ? data.record : item))
        );
        showToast("Demo enquiry updated.");
      }
    } finally {
      setSavingEnquiryId(null);
    }
  }

  async function handleDeleteEnquiry(id: string) {
    if (!window.confirm("Delete this demo enquiry permanently?")) return;
    const res = await fetch(
      `/api/admin/submissions?kind=demo&id=${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setDemoEnquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedEnquiryId === id) {
        setSelectedEnquiryId(null);
      }
      showToast("Demo enquiry deleted.");
    }
  }

  // Filtered Subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((item) => {
      if (subStatusFilter !== "all" && item.status !== subStatusFilter) {
        return false;
      }
      if (!subSearch.trim()) return true;
      const q = subSearch.toLowerCase();
      return (
        item.email.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
      );
    });
  }, [subscriptions, subStatusFilter, subSearch]);

  async function handleToggleSubscriptionStatus(item: SubscriptionRecord) {
    const nextStatus: SubscriptionStatus =
      item.status === "active" ? "unsubscribed" : "active";
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "subscription",
        id: item.id,
        status: nextStatus,
      }),
    });
    const data = await res.json();
    if (res.ok && data.record) {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === item.id ? data.record : s))
      );
      showToast(`Subscriber marked as ${nextStatus}.`);
    }
  }

  async function handleDeleteSubscription(id: string) {
    if (!window.confirm("Remove this email subscriber permanently?")) return;
    const res = await fetch(
      `/api/admin/submissions?kind=subscription&id=${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      showToast("Subscriber deleted.");
    }
  }

  // CSV Export helper
  function downloadCsv(filename: string, headers: string[], rows: string[][]) {
    const escapeCell = (cell: string) =>
      `"${String(cell ?? "").replace(/"/g, '""')}"`;
    const csvContent = [
      headers.map(escapeCell).join(","),
      ...rows.map((r) => r.map(escapeCell).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportDemoEnquiriesCsv() {
    downloadCsv(
      `plethora-demo-enquiries-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        "ID",
        "Status",
        "Created At",
        "Full Name",
        "Email",
        "Company",
        "Guard Count",
        "Operational Focus",
        "Internal Notes",
      ],
      demoEnquiries.map((e) => [
        e.id,
        e.status,
        e.createdAt,
        e.name,
        e.email,
        e.company,
        e.guardCount,
        e.operationalFocus,
        e.internalNotes || "",
      ])
    );
  }

  function exportSubscriptionsCsv() {
    downloadCsv(
      `plethora-subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
      ["ID", "Email", "Status", "Source", "Consent", "Created At"],
      subscriptions.map((s) => [
        s.id,
        s.email,
        s.status,
        s.source,
        String(s.consent),
        s.createdAt,
      ])
    );
  }

  // Blog Editor helpers
  function startNewArticle() {
    setBlogPreviewMode(false);
    setEditingArticle({
      title: "",
      slug: "",
      excerpt: "",
      author: "Aobakwe Dipitso",
      authorRole: "Founder & Director, Plethora (Pty) Ltd",
      publishedAt: new Date().toISOString().slice(0, 10),
      category: "Operations",
      tags: "Private Security, Workforce Management, Operations",
      coverLabel: "Operational Brief",
      coverHighlight: "Connected security workforce operations",
      seoDescription: "",
      status: "draft",
      editorialNotice: "Editorial draft — pending final review",
      content:
        "## Operational Context\n\nWrite your article in Markdown here.\n\n### Key Takeaways\n\n- Connected guard and site records reduce manual handovers.\n- Role-based approvals preserve operational accountability.",
    });
  }

  function startEditArticle(article: BlogArticle) {
    setBlogPreviewMode(false);
    setEditingArticle({
      originalSlug: article.slug,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      author: article.author,
      authorRole: article.authorRole,
      publishedAt: article.publishedAt,
      category: article.category,
      tags: article.tags.join(", "),
      coverLabel: article.coverLabel,
      coverHighlight: article.coverHighlight,
      seoDescription: article.seoDescription,
      status: article.status,
      editorialNotice: article.editorialNotice,
      content: article.content,
    });
  }

  async function handleSaveArticle(e: React.FormEvent) {
    e.preventDefault();
    if (!editingArticle) return;
    setSavingBlog(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingArticle),
      });
      const data = await res.json();
      if (res.ok && data.articles) {
        setArticles(data.articles);
        setEditingArticle(null);
        showToast(`Article "${data.article.title}" saved.`);
      } else {
        showToast(data.message || "Could not save article.");
      }
    } finally {
      setSavingBlog(false);
    }
  }

  async function handleQuickToggleArticleStatus(article: BlogArticle) {
    const nextStatus = article.status === "published" ? "draft" : "published";
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...article,
        originalSlug: article.slug,
        status: nextStatus,
      }),
    });
    const data = await res.json();
    if (res.ok && data.articles) {
      setArticles(data.articles);
      showToast(
        `Article "${article.title}" ${
          nextStatus === "published" ? "published to /blog" : "moved to drafts"
        }.`
      );
    }
  }

  async function handleDeleteArticle(slug: string, title: string) {
    if (!window.confirm(`Delete article "${title}" permanently?`)) return;
    const res = await fetch(
      `/api/admin/blog?slug=${encodeURIComponent(slug)}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    if (res.ok && data.articles) {
      setArticles(data.articles);
      showToast(`Deleted "${title}".`);
    }
  }

  // Save Website Settings
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      // If user also typed a new password into the password fields above, save it simultaneously
      if (newPassword.trim().length > 0) {
        if (newPassword.trim().length < 4) {
          setPasswordFeedback({
            ok: false,
            message: "New password must be at least 4 characters long.",
          });
          setSavingSettings(false);
          return;
        }
        if (
          confirmPassword.trim().length > 0 &&
          newPassword.trim() !== confirmPassword.trim()
        ) {
          setPasswordFeedback({
            ok: false,
            message: "New password and confirmation password do not match.",
          });
          setSavingSettings(false);
          return;
        }

        const pwRes = await fetch("/api/admin/auth", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "change_password",
            newPassword: newPassword.trim(),
            confirmPassword: confirmPassword.trim() || newPassword.trim(),
          }),
        });
        const pwData = await pwRes.json();
        if (pwRes.ok && pwData.ok) {
          setNewPassword("");
          setConfirmPassword("");
          if (pwData.securityInfo) setSecurityInfo(pwData.securityInfo);
          setPasswordFeedback({
            ok: true,
            message:
              pwData.message ||
              "New administrator password saved.",
          });
        }
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.settings) {
        setSettings(data.settings);
        showToast("Website settings saved and published to live pages.");
      } else {
        showToast(data.message || "Failed to update settings.");
      }
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleResetSettings() {
    if (
      !window.confirm(
        "Restore all website copy and controls back to Plethora defaults?"
      )
    ) {
      return;
    }
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToDefaults: true }),
      });
      const data = await res.json();
      if (res.ok && data.settings) {
        setSettings(data.settings);
        showToast("Website settings restored to official defaults.");
      }
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordFeedback(null);

    const trimmedNew = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (trimmedNew.length < 4) {
      setPasswordFeedback({
        ok: false,
        message: "New password must be at least 4 characters long.",
      });
      return;
    }

    if (trimmedConfirm.length > 0 && trimmedNew !== trimmedConfirm) {
      setPasswordFeedback({
        ok: false,
        message: "New password and confirmation password do not match.",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          newPassword: trimmedNew,
          confirmPassword: trimmedConfirm || trimmedNew,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setNewPassword("");
        setConfirmPassword("");
        if (data.securityInfo) {
          setSecurityInfo(data.securityInfo);
        }
        setPasswordFeedback({
          ok: true,
          message:
            data.message ||
            "New administrator password saved. Use this password the next time you sign in.",
        });
        showToast("Administrator password updated.");
      } else {
        setPasswordFeedback({
          ok: false,
          message: data.message || "Failed to update password.",
        });
      }
    } catch {
      setPasswordFeedback({
        ok: false,
        message: "Network error while updating password.",
      });
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleResetDefaultPassword() {
    if (
      !window.confirm(
        "Reset the administrator password back to the default (plethora-admin-2026)?"
      )
    ) {
      return;
    }
    setChangingPassword(true);
    setPasswordFeedback(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_default_password" }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (data.securityInfo) setSecurityInfo(data.securityInfo);
        setPasswordFeedback({
          ok: true,
          message:
            data.message ||
            "Administrator password restored to default (plethora-admin-2026).",
        });
        showToast("Password restored to default (plethora-admin-2026).");
      }
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleRevokeSessions() {
    setRevokingSessions(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke_sessions" }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (data.securityInfo) setSecurityInfo(data.securityInfo);
        showToast("All other administrator sessions have been signed out.");
      }
    } finally {
      setRevokingSessions(false);
    }
  }

  const newEnquiriesCount = demoEnquiries.filter(
    (e) => e.status === "new"
  ).length;
  const activeSubsCount = subscriptions.filter(
    (s) => s.status === "active"
  ).length;
  const publishedPostsCount = articles.filter(
    (a) => a.status === "published"
  ).length;
  const draftPostsCount = articles.filter((a) => a.status === "draft").length;

  return (
    <div className="min-h-dvh bg-[#f7f6f2] text-black flex flex-col">
      {/* PLETHORA ERP SIGNATURE ORANGE TOP BAR */}
      <header className="sticky top-0 z-40 bg-[#ff6e14] border-b border-[#c04900]/30 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white px-2.5 py-1.5 shadow-2xs">
                <BrandLogo variant="primary" height={20} />
              </div>
              <div>
                <span className="font-heading text-sm font-medium text-black block leading-none">
                  Website Admin Console
                </span>
                <span className="font-mono text-[11px] text-black/80">
                  plethoraqbs.co.za · Communications &amp; CMS
                </span>
              </div>
            </div>

            {/* Navigation Pills */}
            <nav
              aria-label="Admin sections"
              className="hidden lg:flex items-center gap-1.5"
            >
              {(
                [
                  {
                    id: "overview",
                    label: "Overview",
                    icon: LayoutDashboard,
                  },
                  {
                    id: "enquiries",
                    label: "Demo Enquiries",
                    icon: Inbox,
                    badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
                  },
                  {
                    id: "subscribers",
                    label: "Email Subscribers",
                    icon: Mail,
                    badge: activeSubsCount,
                  },
                  {
                    id: "blog",
                    label: "Blog & CMS",
                    icon: FileText,
                    badge: articles.length,
                  },
                  {
                    id: "settings",
                    label: "Website Settings",
                    icon: Settings,
                  },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? "bg-white text-black shadow-xs"
                        : "text-black/90 hover:bg-black/10"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{tab.label}</span>
                    {"badge" in tab && tab.badge !== undefined ? (
                      <span
                        className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                          active
                            ? "bg-[#ff6e14] text-black"
                            : "bg-black/15 text-black"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshAllData}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2 text-xs font-medium text-black hover:bg-white cursor-pointer"
              title="Sync latest submissions and content"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-2 text-xs font-medium text-white hover:bg-zinc-800"
            >
              <span>Live Site</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black/15 px-3 py-2 text-xs font-medium text-black hover:bg-black/25 cursor-pointer"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Tab Bar */}
        <div className="mt-3 flex lg:hidden overflow-x-auto gap-1.5 pb-1">
          {(
            [
              { id: "overview", label: "Overview" },
              {
                id: "enquiries",
                label: `Demo Enquiries (${demoEnquiries.length})`,
              },
              {
                id: "subscribers",
                label: `Subscribers (${subscriptions.length})`,
              },
              { id: "blog", label: `Blog (${articles.length})` },
              { id: "settings", label: "Settings" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "bg-black/10 text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-[#5ad824] bg-black px-4 py-3 text-xs font-medium text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-[#5ad824]" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
                  Operations &amp; Communications Command
                </p>
                <h1 className="font-heading mt-1 text-2xl font-medium text-black sm:text-3xl">
                  Plethora Website &amp; Inbox Overview
                </h1>
              </div>
              {usingDefaultPassword && (
                <div className="rounded-lg border border-[#f4a834] bg-[#f4a834]/15 px-3.5 py-2 text-xs text-black">
                  <strong>Security Notice:</strong> Using default local password (
                  <code className="font-mono">plethora-admin-2026</code>). Set{" "}
                  <code className="font-mono">PLETHORA_ADMIN_PASSWORD</code> in
                  production.
                </div>
              )}
            </div>

            {/* KPI BENTO CARDS */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#e4e4e4] bg-white p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-600">
                    Demo Enquiries
                  </span>
                  <Inbox className="h-4 w-4 text-[#ff6e14]" />
                </div>
                <div className="mt-4">
                  <p className="font-heading text-3xl font-medium text-black">
                    {demoEnquiries.length}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    <strong className="text-[#c04900]">
                      {newEnquiriesCount} unread / new
                    </strong>{" "}
                    awaiting response
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("enquiries")}
                  className="mt-4 text-left text-xs font-medium text-[#c04900] hover:text-black cursor-pointer"
                >
                  Open demo inbox →
                </button>
              </div>

              <div className="rounded-2xl border border-[#e4e4e4] bg-white p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-600">
                    Email Subscribers
                  </span>
                  <Mail className="h-4 w-4 text-[#ff6e14]" />
                </div>
                <div className="mt-4">
                  <p className="font-heading text-3xl font-medium text-black">
                    {activeSubsCount}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Active opt-in subscribers ({subscriptions.length} total)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("subscribers")}
                  className="mt-4 text-left text-xs font-medium text-[#c04900] hover:text-black cursor-pointer"
                >
                  Manage mailing list →
                </button>
              </div>

              <div className="rounded-2xl border border-[#e4e4e4] bg-white p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-600">
                    Editorial &amp; Blog
                  </span>
                  <FileText className="h-4 w-4 text-[#ff6e14]" />
                </div>
                <div className="mt-4">
                  <p className="font-heading text-3xl font-medium text-black">
                    {publishedPostsCount}{" "}
                    <span className="text-sm font-normal text-zinc-500">
                      published
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {draftPostsCount} draft article
                    {draftPostsCount === 1 ? "" : "s"} in repository
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("blog")}
                  className="mt-4 text-left text-xs font-medium text-[#c04900] hover:text-black cursor-pointer"
                >
                  Open Blog CMS →
                </button>
              </div>

              <div className="rounded-2xl border border-[#e4e4e4] bg-white p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-600">
                    Website Configuration
                  </span>
                  <Settings className="h-4 w-4 text-[#ff6e14]" />
                </div>
                <div className="mt-4">
                  <p className="font-heading text-base font-medium text-black">
                    {settings.announcementEnabled
                      ? "Announcement Banner Active"
                      : "Standard Hero Mode"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600 truncate">
                    Contact: {settings.contactEmail}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className="mt-4 text-left text-xs font-medium text-[#c04900] hover:text-black cursor-pointer"
                >
                  Configure site settings →
                </button>
              </div>
            </div>

            {/* RECENT DEMO ENQUIRIES & RECENT SUBSCRIBERS */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="rounded-2xl border border-[#e4e4e4] bg-white p-6 lg:col-span-7">
                <div className="flex items-center justify-between border-b border-[#e4e4e4] pb-4">
                  <div>
                    <h2 className="font-heading text-lg font-medium text-black">
                      Recent Demo Enquiries
                    </h2>
                    <p className="text-xs text-zinc-600">
                      Prospective private security companies requesting a walkthrough
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("enquiries")}
                    className="rounded-lg border border-[#e4e4e4] px-3 py-1.5 text-xs font-medium text-black hover:bg-[#f7f6f2] cursor-pointer"
                  >
                    View all ({demoEnquiries.length})
                  </button>
                </div>

                {demoEnquiries.length === 0 ? (
                  <p className="py-8 text-center text-sm text-zinc-500">
                    No demo enquiries recorded yet. Submit the form on{" "}
                    <Link href="/contact" className="underline text-[#c04900]">
                      /contact
                    </Link>{" "}
                    to test.
                  </p>
                ) : (
                  <div className="divide-y divide-[#e4e4e4]">
                    {demoEnquiries.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-sm text-black">
                              {item.company}
                            </span>
                            <span className="rounded bg-[#f7f6f2] border border-[#e4e4e4] px-2 py-0.5 font-mono text-[11px] text-zinc-700">
                              {item.guardCount} guards
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] ${
                                STATUS_STYLES[item.status]
                              }`}
                            >
                              {STATUS_LABELS[item.status]}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-zinc-600">
                            {item.name} ·{" "}
                            <a
                              href={`mailto:${item.email}`}
                              className="underline hover:text-[#c04900]"
                            >
                              {item.email}
                            </a>
                          </p>
                          {item.operationalFocus && (
                            <p className="mt-1 text-xs text-zinc-700 line-clamp-1">
                              “{item.operationalFocus}”
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            selectEnquiry(item);
                            setActiveTab("enquiries");
                          }}
                          className="shrink-0 rounded-lg bg-[#f7f6f2] px-3 py-1.5 text-xs font-medium text-black hover:bg-[#fcb488] cursor-pointer"
                        >
                          Open message
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[#e4e4e4] bg-white p-6 lg:col-span-5">
                <div className="flex items-center justify-between border-b border-[#e4e4e4] pb-4">
                  <div>
                    <h2 className="font-heading text-lg font-medium text-black">
                      Latest Email Subscribers
                    </h2>
                    <p className="text-xs text-zinc-600">
                      Opt-in product &amp; editorial update list
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("subscribers")}
                    className="rounded-lg border border-[#e4e4e4] px-3 py-1.5 text-xs font-medium text-black hover:bg-[#f7f6f2] cursor-pointer"
                  >
                    View all ({subscriptions.length})
                  </button>
                </div>

                {subscriptions.length === 0 ? (
                  <p className="py-8 text-center text-sm text-zinc-500">
                    No email subscribers recorded yet.
                  </p>
                ) : (
                  <div className="divide-y divide-[#e4e4e4]">
                    {subscriptions.slice(0, 6).map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between gap-2 py-3.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-black">
                            {sub.email}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            Source: {sub.source} ·{" "}
                            {sub.createdAt.slice(0, 10)}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                            sub.status === "active"
                              ? "bg-[#5ad824]/20 text-black border border-[#5ad824]"
                              : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEMO ENQUIRIES INBOX */}
        {activeTab === "enquiries" && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
                  Journey 01 · Demo &amp; Evaluation Inbox
                </p>
                <h1 className="font-heading mt-1 text-2xl font-medium text-black">
                  Demo Enquiries ({demoEnquiries.length})
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={exportDemoEnquiriesCsv}
                  disabled={demoEnquiries.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#d0ceca] bg-white px-3.5 py-2 text-xs font-medium text-black hover:bg-[#f7f6f2] disabled:opacity-50 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-[#e4e4e4] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  placeholder="Search by security company, contact name, email, or message..."
                  aria-label="Search demo enquiries"
                  className="w-full rounded-lg border border-[#d0ceca] bg-[#f7f6f2] pl-9 pr-4 py-2 text-sm text-black placeholder:text-zinc-500 focus:border-[#ff6e14] focus:bg-white focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "new", label: "New" },
                    { id: "contacted", label: "Contacted" },
                    { id: "pilot_scoped", label: "Pilot Scoped" },
                    { id: "archived", label: "Archived" },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setEnquiryStatusFilter(st.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer ${
                      enquiryStatusFilter === st.id
                        ? "bg-black text-white"
                        : "bg-[#f7f6f2] text-zinc-700 hover:bg-[#e4e4e4]"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Pane: Inbox List + Message Reader */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column: Enquiry List */}
              <div className="rounded-2xl border border-[#e4e4e4] bg-white overflow-hidden lg:col-span-5">
                {filteredEnquiries.length === 0 ? (
                  <div className="p-8 text-center text-sm text-zinc-500">
                    No demo enquiries match the current filter.
                  </div>
                ) : (
                  <div className="divide-y divide-[#e4e4e4] max-h-[640px] overflow-y-auto">
                    {filteredEnquiries.map((item) => {
                      const isSelected = selectedEnquiry?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectEnquiry(item)}
                          className={`w-full text-left p-4 transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#fff3eb] border-l-4 border-l-[#ff6e14]"
                              : "hover:bg-[#f7f6f2]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-heading text-sm font-medium text-black truncate">
                              {item.company}
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                                STATUS_STYLES[item.status]
                              }`}
                            >
                              {STATUS_LABELS[item.status]}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-xs text-zinc-600">
                            <span>{item.name}</span>
                            <span className="font-mono text-[11px] text-[#c04900]">
                              {item.guardCount} guards
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2">
                            {item.operationalFocus ||
                              "No additional operational notes provided."}
                          </p>
                          <p className="mt-2 font-mono text-[10px] text-zinc-400">
                            {new Date(item.createdAt).toLocaleString("en-ZA")}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Full Enquiry Reader & Action Panel */}
              <div className="rounded-2xl border border-[#e4e4e4] bg-white p-6 lg:col-span-7">
                {!selectedEnquiry ? (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center text-sm text-zinc-500">
                    <Inbox className="h-8 w-8 text-zinc-300 mb-2" />
                    <p>Select a demo enquiry on the left to read full details.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e4e4e4] pb-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                            Demo Evaluation Request
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs ${
                              STATUS_STYLES[selectedEnquiry.status]
                            }`}
                          >
                            {STATUS_LABELS[selectedEnquiry.status]}
                          </span>
                        </div>
                        <h2 className="font-heading mt-2 text-2xl font-medium text-black">
                          {selectedEnquiry.company}
                        </h2>
                        <p className="mt-1 text-sm text-zinc-700">
                          Contact:{" "}
                          <strong className="text-black">
                            {selectedEnquiry.name}
                          </strong>{" "}
                          ·{" "}
                          <a
                            href={`mailto:${selectedEnquiry.email}`}
                            className="text-[#c04900] underline"
                          >
                            {selectedEnquiry.email}
                          </a>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`mailto:${
                            selectedEnquiry.email
                          }?subject=${encodeURIComponent(
                            `Plethora Operational Demo — ${selectedEnquiry.company}`
                          )}&body=${encodeURIComponent(
                            `Hi ${selectedEnquiry.name},\n\nThank you for requesting a walkthrough of Plethora for ${selectedEnquiry.company} (${selectedEnquiry.guardCount} guards).\n\nWe would be glad to schedule a session focused on your operational priorities.\n\nBest regards,\nAobakwe Dipitso\nPlethora (Pty) Ltd`
                          )}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff6e14] px-3.5 py-2 text-xs font-medium text-black hover:bg-[#fcb488]"
                        >
                          <Send className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Reply via Email</span>
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteEnquiry(selectedEnquiry.id)
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-[#e4e4e4] px-3 py-2 text-xs font-medium text-[#f63232] hover:bg-[#f63232]/10 cursor-pointer"
                          title="Delete enquiry"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-[#f7f6f2] p-3.5 border border-[#e4e4e4]">
                        <span className="block font-mono text-[10px] uppercase text-zinc-500">
                          Guard Fleet Band
                        </span>
                        <span className="mt-1 block font-heading text-base font-medium text-black">
                          {selectedEnquiry.guardCount} guards
                        </span>
                      </div>
                      <div className="rounded-xl bg-[#f7f6f2] p-3.5 border border-[#e4e4e4]">
                        <span className="block font-mono text-[10px] uppercase text-zinc-500">
                          Received Timestamp
                        </span>
                        <span className="mt-1 block font-mono text-xs text-black">
                          {new Date(selectedEnquiry.createdAt).toLocaleString(
                            "en-ZA"
                          )}
                        </span>
                      </div>
                      <div className="rounded-xl bg-[#f7f6f2] p-3.5 border border-[#e4e4e4]">
                        <span className="block font-mono text-[10px] uppercase text-zinc-500">
                          Consent Boundary
                        </span>
                        <span className="mt-1 block text-xs text-black">
                          Demo response only (No marketing opt-in)
                        </span>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-600">
                        Operational Focus &amp; Message
                      </h3>
                      <div className="mt-2 rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-4 text-sm leading-relaxed text-black whitespace-pre-wrap">
                        {selectedEnquiry.operationalFocus ||
                          "No additional operational priorities were written in this submission."}
                      </div>
                    </div>

                    {/* Pipeline Status Controls */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-zinc-600">
                        Update Pipeline Status
                      </label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(
                          [
                            "new",
                            "contacted",
                            "pilot_scoped",
                            "archived",
                          ] as DemoEnquiryStatus[]
                        ).map((st) => (
                          <button
                            key={st}
                            type="button"
                            disabled={savingEnquiryId === selectedEnquiry.id}
                            onClick={() =>
                              handleUpdateEnquiry(selectedEnquiry.id, {
                                status: st,
                              })
                            }
                            className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                              selectedEnquiry.status === st
                                ? "bg-black text-white"
                                : "border border-[#d0ceca] bg-white text-black hover:bg-[#f7f6f2]"
                            }`}
                          >
                            {STATUS_LABELS[st]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Internal Follow-up Notes */}
                    <div>
                      <label
                        htmlFor="enquiry-internal-notes"
                        className="block font-mono text-xs uppercase tracking-wider text-zinc-600"
                      >
                        Internal Follow-Up Notes
                      </label>
                      <textarea
                        id="enquiry-internal-notes"
                        rows={3}
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Record call outcomes, number of sites, PSIRA/NBCPSS requirements, or pilot scoping notes..."
                        className="mt-2 w-full rounded-xl border border-[#d0ceca] bg-white p-3 text-sm text-black placeholder:text-zinc-400 focus:border-[#ff6e14] focus:outline-none"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          disabled={savingEnquiryId === selectedEnquiry.id}
                          onClick={() =>
                            handleUpdateEnquiry(selectedEnquiry.id, {
                              internalNotes: noteDraft,
                            })
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 cursor-pointer"
                        >
                          <Save className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Save Internal Notes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EMAIL SUBSCRIBERS */}
        {activeTab === "subscribers" && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
                  Journey 02 · Product Updates &amp; Editorial Audience
                </p>
                <h1 className="font-heading mt-1 text-2xl font-medium text-black">
                  Email Subscribers ({subscriptions.length})
                </h1>
              </div>
              <button
                type="button"
                onClick={exportSubscriptionsCsv}
                disabled={subscriptions.length === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-[#d0ceca] bg-white px-3.5 py-2 text-xs font-medium text-black hover:bg-[#f7f6f2] disabled:opacity-50 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Export Subscribers CSV</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-[#e4e4e4] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  placeholder="Search subscribers by email address or signup page source..."
                  aria-label="Search email subscribers"
                  className="w-full rounded-lg border border-[#d0ceca] bg-[#f7f6f2] pl-9 pr-4 py-2 text-sm text-black placeholder:text-zinc-500 focus:border-[#ff6e14] focus:bg-white focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5">
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "active", label: "Active" },
                    { id: "unsubscribed", label: "Unsubscribed" },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSubStatusFilter(st.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer ${
                      subStatusFilter === st.id
                        ? "bg-black text-white"
                        : "bg-[#f7f6f2] text-zinc-700 hover:bg-[#e4e4e4]"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subscribers Table */}
            <div className="rounded-2xl border border-[#e4e4e4] bg-white overflow-hidden">
              {filteredSubscriptions.length === 0 ? (
                <div className="p-10 text-center text-sm text-zinc-500">
                  No email subscribers match your search.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-[#e4e4e4] bg-[#f7f6f2] font-mono text-[11px] uppercase text-zinc-600">
                      <tr>
                        <th className="px-5 py-3.5">Email Address</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Source Page</th>
                        <th className="px-5 py-3.5">POPIA Consent</th>
                        <th className="px-5 py-3.5">Subscribed Date</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e4e4]">
                      {filteredSubscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-[#f7f6f2]/60">
                          <td className="px-5 py-3.5 font-medium text-black">
                            <a
                              href={`mailto:${sub.email}`}
                              className="hover:text-[#c04900] hover:underline"
                            >
                              {sub.email}
                            </a>
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                sub.status === "active"
                                  ? "bg-[#5ad824]/20 text-black border border-[#5ad824]"
                                  : "bg-zinc-200 text-zinc-600"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs text-zinc-700">
                            {sub.source}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-zinc-600">
                            Explicit opt-in ({sub.consentPurpose})
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs text-zinc-600">
                            {new Date(sub.createdAt).toLocaleString("en-ZA")}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleSubscriptionStatus(sub)
                                }
                                className="rounded-lg border border-[#d0ceca] bg-white px-2.5 py-1 text-xs font-medium text-black hover:bg-[#f7f6f2] cursor-pointer"
                              >
                                {sub.status === "active"
                                  ? "Unsubscribe"
                                  : "Reactivate"}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteSubscription(sub.id)
                                }
                                className="rounded-lg p-1.5 text-zinc-500 hover:bg-[#f63232]/10 hover:text-[#f63232] cursor-pointer"
                                title="Delete subscriber"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
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
        )}

        {/* TAB 4: BLOG & EDITORIAL CMS */}
        {activeTab === "blog" && (
          <div className="space-y-6">
            {!editingArticle ? (
              <>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
                      Markdown Repository CMS · content/blog/*.md
                    </p>
                    <h1 className="font-heading mt-1 text-2xl font-medium text-black">
                      Blog &amp; Editorial Articles ({articles.length})
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={startNewArticle}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#ff6e14] px-4 py-2.5 text-xs font-medium text-black hover:bg-[#fcb488] cursor-pointer"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Write New Article</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {articles.map((article) => (
                    <div
                      key={article.slug}
                      className="rounded-2xl border border-[#e4e4e4] bg-white p-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center"
                    >
                      <div className="space-y-1.5 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              article.status === "published"
                                ? "bg-[#5ad824]/20 text-black border border-[#5ad824]"
                                : "bg-[#f4a834]/25 text-black border border-[#f4a834]"
                            }`}
                          >
                            {article.status === "published"
                              ? "Published"
                              : "Draft (Hidden from public)"}
                          </span>
                          <span className="font-mono text-xs text-[#c04900]">
                            {article.category}
                          </span>
                          <span className="text-xs text-zinc-400">·</span>
                          <span className="font-mono text-xs text-zinc-600">
                            {article.publishedAt}
                          </span>
                          <span className="text-xs text-zinc-400">·</span>
                          <span className="font-mono text-xs text-zinc-600">
                            {article.readingTimeMinutes} min read
                          </span>
                        </div>

                        <h2 className="font-heading text-lg font-medium text-black">
                          {article.title}
                        </h2>
                        <p className="text-xs text-zinc-600 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <p className="font-mono text-[11px] text-zinc-500">
                          Slug: /blog/{article.slug} · Notice:{" "}
                          {article.editorialNotice}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditArticle(article)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0ceca] bg-white px-3.5 py-2 text-xs font-medium text-black hover:bg-[#f7f6f2] cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Edit Article</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleQuickToggleArticleStatus(article)
                          }
                          className={`rounded-lg px-3.5 py-2 text-xs font-medium cursor-pointer ${
                            article.status === "published"
                              ? "bg-[#f7f6f2] text-zinc-800 hover:bg-[#e4e4e4]"
                              : "bg-[#ff6e14] text-black hover:bg-[#fcb488]"
                          }`}
                        >
                          {article.status === "published"
                            ? "Move to Draft"
                            : "Publish Now"}
                        </button>

                        {article.status === "published" && (
                          <Link
                            href={`/blog/${article.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-lg border border-[#e4e4e4] px-3 py-2 text-xs font-medium text-zinc-700 hover:text-black"
                            title="View live post"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteArticle(article.slug, article.title)
                          }
                          className="rounded-lg p-2 text-zinc-500 hover:bg-[#f63232]/10 hover:text-[#f63232] cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* BLOG MARKDOWN STUDIO EDITOR */
              <form
                onSubmit={handleSaveArticle}
                className="rounded-2xl border border-[#e4e4e4] bg-white p-6 sm:p-8 space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e4e4e4] pb-4">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                      Editorial Markdown Studio
                    </span>
                    <h2 className="font-heading text-xl font-medium text-black">
                      {editingArticle.originalSlug
                        ? `Editing: ${editingArticle.title}`
                        : "Create New Blog Article"}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBlogPreviewMode((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0ceca] bg-[#f7f6f2] px-3.5 py-2 text-xs font-medium text-black hover:bg-[#e4e4e4] cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>
                        {blogPreviewMode
                          ? "Back to Editor"
                          : "Preview Formatted Post"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingArticle(null)}
                      className="rounded-lg border border-[#e4e4e4] px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-[#f7f6f2] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingBlog}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#ff6e14] px-4 py-2 text-xs font-medium text-black hover:bg-[#fcb488] cursor-pointer"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>
                        {savingBlog ? "Saving..." : "Save Article to Repository"}
                      </span>
                    </button>
                  </div>
                </div>

                {blogPreviewMode ? (
                  <div className="rounded-2xl border border-[#e4e4e4] bg-[#f7f6f2] p-6 sm:p-10">
                    <div className="mx-auto max-w-3xl bg-white p-8 rounded-2xl border border-[#e4e4e4]">
                      <span className="font-mono text-xs text-[#c04900]">
                        {editingArticle.category} · {editingArticle.publishedAt}
                      </span>
                      <h1 className="font-heading mt-2 text-3xl font-medium text-black">
                        {editingArticle.title || "Untitled Article"}
                      </h1>
                      <p className="mt-3 text-base text-zinc-600">
                        {editingArticle.excerpt}
                      </p>
                      <div className="mt-8 border-t border-[#e4e4e4] pt-8">
                        <MarkdownContent content={editingArticle.content} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-black">
                          Article Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingArticle.title}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              title: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 text-sm text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black">
                          URL Slug (leave blank to auto-generate from title)
                        </label>
                        <input
                          type="text"
                          value={editingArticle.slug}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              slug: e.target.value,
                            })
                          }
                          placeholder="e.g. security-rostering-guide"
                          className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 font-mono text-sm text-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                      <div>
                        <label className="block text-xs font-medium text-black">
                          Publication Status
                        </label>
                        <select
                          value={editingArticle.status}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              status: e.target.value as "published" | "draft",
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-[#d0ceca] bg-white px-3 py-2 text-sm text-black"
                        >
                          <option value="published">Published (Live)</option>
                          <option value="draft">Draft (Hidden)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black">
                          Category
                        </label>
                        <input
                          type="text"
                          value={editingArticle.category}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              category: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3 py-2 text-sm text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black">
                          Published Date
                        </label>
                        <input
                          type="date"
                          value={editingArticle.publishedAt}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              publishedAt: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3 py-2 text-sm text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black">
                          Editorial Notice Badge
                        </label>
                        <input
                          type="text"
                          value={editingArticle.editorialNotice}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              editorialNotice: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3 py-2 text-sm text-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-black">
                        Short Excerpt / Summary (shown on blog cards &amp; SEO)
                      </label>
                      <textarea
                        rows={2}
                        value={editingArticle.excerpt}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            excerpt: e.target.value,
                            seoDescription: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-[#d0ceca] p-3 text-sm text-black"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium text-black">
                          Author Name
                        </label>
                        <input
                          type="text"
                          value={editingArticle.author}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              author: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3 py-2 text-sm text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black">
                          Cover Card Label
                        </label>
                        <input
                          type="text"
                          value={editingArticle.coverLabel}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              coverLabel: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3 py-2 text-sm text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editingArticle.tags}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              tags: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3 py-2 text-sm text-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-black">
                        Article Content (Markdown) *
                      </label>
                      <textarea
                        rows={16}
                        required
                        value={editingArticle.content}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            content: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-[#d0ceca] bg-[#f7f6f2] p-4 font-mono text-sm leading-relaxed text-black focus:bg-white focus:border-[#ff6e14] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {/* TAB 5: WEBSITE & SECURITY SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
                  Security, Routing &amp; Live Website Configuration
                </p>
                <h1 className="font-heading mt-1 text-2xl font-medium text-black">
                  Admin Security &amp; Website Controls
                </h1>
                <p className="mt-1 text-sm text-zinc-600">
                  Manage administrator access credentials, active sessions, form intake routing, and live public website copy.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetSettings}
                disabled={savingSettings}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0ceca] bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-[#f7f6f2] hover:text-black cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Restore Default Website Copy</span>
              </button>
            </div>

            {/* PANEL 1: ADMINISTRATOR PASSWORD & SESSION SECURITY */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <form
                onSubmit={handleChangePassword}
                className="rounded-2xl border border-[#e4e4e4] bg-white p-6 sm:p-8 lg:col-span-8 space-y-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e4e4e4] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3eb] border border-[#fcb488] text-[#c04900]">
                      <KeyRound className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-medium text-black">
                        Set New Administrator Password
                      </h2>
                      <p className="text-xs text-zinc-600">
                        Stored as a salted <code className="font-mono">scrypt</code> hash in{" "}
                        <code className="font-mono">data/admin-security.json</code>. Updating your password automatically invalidates other sessions.
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      securityInfo.usingDefaultPassword
                        ? "bg-[#f4a834]/25 text-black border border-[#f4a834]"
                        : "bg-[#5ad824]/20 text-black border border-[#5ad824]"
                    }`}
                  >
                    {securityInfo.passwordSource === "custom_stored"
                      ? "Custom Password Active"
                      : securityInfo.passwordSource === "env_variable"
                      ? "Environment Password Active"
                      : "Default Dev Password Active"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="new-admin-password"
                      className="block text-xs font-medium text-black"
                    >
                      New Administrator Password (min 4 chars) *
                    </label>
                    <input
                      id="new-admin-password"
                      type={showPasswords ? "text" : "password"}
                      required
                      minLength={4}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new admin password..."
                      className="mt-1.5 w-full rounded-lg border border-[#d0ceca] bg-white px-3.5 py-2 text-sm text-black focus:border-[#ff6e14] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-admin-password"
                      className="block text-xs font-medium text-black"
                    >
                      Confirm New Password *
                    </label>
                    <input
                      id="confirm-admin-password"
                      type={showPasswords ? "text" : "password"}
                      required
                      minLength={4}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password..."
                      className="mt-1.5 w-full rounded-lg border border-[#d0ceca] bg-white px-3.5 py-2 text-sm text-black focus:border-[#ff6e14] focus:outline-none"
                    />
                  </div>
                </div>

                {passwordFeedback && (
                  <div
                    role="alert"
                    className={`flex items-start gap-2 rounded-xl border p-3.5 text-xs ${
                      passwordFeedback.ok
                        ? "border-[#5ad824] bg-[#5ad824]/15 text-black"
                        : "border-[#f63232]/40 bg-[#f63232]/10 text-black"
                    }`}
                  >
                    {passwordFeedback.ok ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5ad824] mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-[#f63232] mt-0.5" />
                    )}
                    <span>{passwordFeedback.message}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e4e4e4] pt-4">
                  <label className="inline-flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPasswords}
                      onChange={(e) => setShowPasswords(e.target.checked)}
                      className="h-4 w-4 accent-[#ff6e14]"
                    />
                    <span>Show password characters</span>
                  </label>

                  <div className="flex flex-wrap items-center gap-2">
                    {securityInfo.passwordSource === "custom_stored" && (
                      <button
                        type="button"
                        disabled={changingPassword}
                        onClick={handleResetDefaultPassword}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#d0ceca] bg-[#f7f6f2] px-3.5 py-2.5 text-xs font-medium text-black hover:bg-[#e4e4e4] disabled:opacity-60 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Restore Default Password</span>
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-60 cursor-pointer"
                    >
                      <KeyRound className="h-3.5 w-3.5 text-[#ff6e14]" aria-hidden="true" />
                      <span>
                        {changingPassword
                          ? "Updating Password..."
                          : "Update Administrator Password"}
                      </span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Session & Access Status Card */}
              <div className="rounded-2xl border border-[#e4e4e4] bg-white p-6 sm:p-7 lg:col-span-4 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-[#ff6e14]" aria-hidden="true" />
                    <h2 className="font-heading text-lg font-medium text-black">
                      Session &amp; Access Status
                    </h2>
                  </div>

                  <dl className="mt-4 space-y-3 text-xs">
                    <div className="rounded-xl bg-[#f7f6f2] p-3 border border-[#e4e4e4]">
                      <dt className="font-mono text-[10px] uppercase text-zinc-500">
                        Active Credential Source
                      </dt>
                      <dd className="mt-1 font-medium text-black">
                        {securityInfo.passwordSource === "custom_stored"
                          ? "Custom Scrypt Password (Admin UI)"
                          : securityInfo.passwordSource === "env_variable"
                          ? "Environment Variable (PLETHORA_ADMIN_PASSWORD)"
                          : "Default Local Credential (plethora-admin-2026)"}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-[#f7f6f2] p-3 border border-[#e4e4e4]">
                      <dt className="font-mono text-[10px] uppercase text-zinc-500">
                        Last Password Rotation
                      </dt>
                      <dd className="mt-1 font-mono text-black">
                        {securityInfo.passwordUpdatedAt
                          ? new Date(
                              securityInfo.passwordUpdatedAt
                            ).toLocaleString("en-ZA")
                          : "Not rotated via UI yet"}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-[#f7f6f2] p-3 border border-[#e4e4e4]">
                      <dt className="font-mono text-[10px] uppercase text-zinc-500">
                        Session Token Policy
                      </dt>
                      <dd className="mt-1 text-black">
                        HMAC-SHA256 HttpOnly cookie ·{" "}
                        {securityInfo.sessionDurationHours}h expiry
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="border-t border-[#e4e4e4] pt-4">
                  <button
                    type="button"
                    disabled={revokingSessions}
                    onClick={handleRevokeSessions}
                    className="w-full rounded-lg border border-[#d0ceca] bg-[#f7f6f2] px-3.5 py-2.5 text-xs font-medium text-black hover:bg-[#fcb488] cursor-pointer"
                  >
                    {revokingSessions
                      ? "Revoking other sessions..."
                      : "Sign Out All Other Devices"}
                  </button>
                </div>
              </div>
            </div>

            {/* PANEL 2: PUBLIC WEBSITE CONFIGURATION FORM */}
            <form
              onSubmit={handleSaveSettings}
              className="space-y-6 rounded-2xl border border-[#e4e4e4] bg-white p-6 sm:p-8"
            >
              {/* Lead Intake & Notification Routing */}
              <div className="border-b border-[#e4e4e4] pb-6 space-y-4">
                <div>
                  <h2 className="font-heading text-lg font-medium text-black">
                    Form Intake &amp; Notification Routing
                  </h2>
                  <p className="text-xs text-zinc-600">
                    Control whether public forms accept submissions and where notifications or webhook events are routed.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex items-start justify-between gap-3 rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-4 cursor-pointer">
                    <div>
                      <span className="block text-xs font-medium text-black">
                        Accept Demo Evaluation Enquiries
                      </span>
                      <span className="mt-0.5 block text-[11px] text-zinc-600">
                        Allow security companies to submit the demo request form on / and /contact.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.acceptingDemoRequests}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          acceptingDemoRequests: e.target.checked,
                        })
                      }
                      className="mt-0.5 h-4 w-4 accent-[#ff6e14]"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-3 rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-4 cursor-pointer">
                    <div>
                      <span className="block text-xs font-medium text-black">
                        Accept Product Update Subscriptions
                      </span>
                      <span className="mt-0.5 block text-[11px] text-zinc-600">
                        Allow visitors to subscribe to product and editorial updates.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.acceptingEmailSignups}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          acceptingEmailSignups: e.target.checked,
                        })
                      }
                      className="mt-0.5 h-4 w-4 accent-[#ff6e14]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-black">
                      Notification Recipient Email (for Resend alerts)
                    </label>
                    <input
                      type="email"
                      value={settings.notificationRecipientEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notificationRecipientEmail: e.target.value,
                        })
                      }
                      placeholder="info@plethoraqbs.co.za"
                      className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 text-sm text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black">
                      Optional Webhook Forwarding URL (CRM / Slack / Zapier)
                    </label>
                    <input
                      type="url"
                      value={settings.webhookForwardingUrl}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          webhookForwardingUrl: e.target.value,
                        })
                      }
                      placeholder="https://hooks.example.com/plethora-leads"
                      className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 font-mono text-sm text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Announcement Banner Section */}
              <div className="border-b border-[#e4e4e4] pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-lg font-medium text-black">
                      Top Announcement Banner
                    </h2>
                    <p className="text-xs text-zinc-600">
                      Display a high-visibility bar above the site navigation for pilot intake or product news.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.announcementEnabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcementEnabled: e.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-[#ff6e14]"
                    />
                    <span className="text-xs font-medium text-black">
                      Enable Banner
                    </span>
                  </label>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-12">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-medium text-black">
                      Announcement Message
                    </label>
                    <input
                      type="text"
                      value={settings.announcementText}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcementText: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 text-sm text-black"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-black">
                      Link Label
                    </label>
                    <input
                      type="text"
                      value={settings.announcementLinkText}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcementLinkText: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 text-sm text-black"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-black">
                      Link Target Path
                    </label>
                    <input
                      type="text"
                      value={settings.announcementLinkHref}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcementLinkHref: e.target.value,
                        })
                      }
                      placeholder="/contact#demo-request"
                      className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 font-mono text-sm text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section Copy */}
              <div className="border-b border-[#e4e4e4] pb-6 space-y-4">
                <div>
                  <h2 className="font-heading text-lg font-medium text-black">
                    Homepage Hero &amp; Call-to-Action Copy
                  </h2>
                  <p className="text-xs text-zinc-600">
                    Manage the primary headline, subheadline, and primary CTA button label.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-black">
                      Hero Eyebrow Badge
                    </label>
                    <input
                      type="text"
                      value={settings.heroBadgeText}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          heroBadgeText: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 text-sm text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black">
                      Primary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={settings.primaryCtaLabel}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          primaryCtaLabel: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 text-sm text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black">
                    Primary Hero Headline (H1)
                  </label>
                  <input
                    type="text"
                    value={settings.heroHeadline}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        heroHeadline: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 text-sm font-medium text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black">
                    Supporting Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={settings.heroSubheadline}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        heroSubheadline: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-[#d0ceca] p-3 text-sm text-black"
                  />
                </div>
              </div>

              {/* Internal Deployment Disclosure Control */}
              <div className="border-b border-[#e4e4e4] pb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-lg font-medium text-black">
                      Internal Operating Base Disclosure (Quick Bopha Security)
                    </h2>
                    <p className="text-xs text-zinc-600">
                      Control whether the dated operating plan figures (88 guards and 103 platform users) are shown publicly on the homepage.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showInternalDeploymentMetrics}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          showInternalDeploymentMetrics: e.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-[#ff6e14]"
                    />
                    <span className="text-xs font-medium text-black">
                      Show Operating Plan Figures
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black">
                    Internal Operating Base Summary Text
                  </label>
                  <textarea
                    rows={2}
                    value={settings.internalDeploymentSummary}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        internalDeploymentSummary: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-[#d0ceca] p-3 text-sm text-black"
                  />
                </div>
              </div>

              {/* Contact & ERP Sign-In URL */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-black">
                    Public Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contactEmail: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 text-sm text-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black">
                    Customer ERP Sign-In URL (optional — leave blank to hide Sign In button)
                  </label>
                  <input
                    type="url"
                    value={settings.appLoginUrl}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        appLoginUrl: e.target.value,
                      })
                    }
                    placeholder="https://app.plethoraqbs.co.za"
                    className="mt-1 w-full rounded-lg border border-[#d0ceca] px-3.5 py-2 font-mono text-sm text-black"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e4e4e4] pt-5">
                <span className="font-mono text-xs text-zinc-500">
                  Last updated:{" "}
                  {new Date(settings.updatedAt).toLocaleString("en-ZA")}
                </span>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#ff6e14] px-5 py-2.5 text-sm font-medium text-black hover:bg-[#fcb488] cursor-pointer"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {savingSettings
                      ? "Saving & Publishing..."
                      : "Save & Publish Website Settings"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
