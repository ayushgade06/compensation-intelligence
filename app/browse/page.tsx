import { BrowseExperience } from "@/components/BrowseExperience";

export default function BrowsePage() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Browse compensation</h1>
        <p className="mt-1 text-sm text-slate-600">
          Filter normalized submissions by company, role, location, and total compensation range.
        </p>
      </div>
      <BrowseExperience />
    </main>
  );
}
