import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white px-4 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
        404 · Page Not Found
      </p>
      <h1 className="type-section-title mt-2 text-black">
        The requested page or article could not be found.
      </h1>
      <p className="mt-3 max-w-md text-sm text-zinc-700">
        It may have been moved, or if it is an editorial article, it may still be marked as an unpublished draft.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#ff6e14] px-5 py-2.5 text-sm font-medium text-black hover:bg-[#fcb488]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Return to homepage</span>
        </Link>
        <Link
          href="/blog"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-black bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-[#f7f6f2]"
        >
          <span>Browse published articles</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
