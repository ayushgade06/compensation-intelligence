import { ComparisonView } from "@/components/ComparisonView";

export default function ComparePage() {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Compare companies</h1>
        <p className="mt-1 text-sm text-slate-600">
          Compare average total compensation, maximum total compensation, and submission volume.
        </p>
      </div>
      <ComparisonView />
    </main>
  );
}
