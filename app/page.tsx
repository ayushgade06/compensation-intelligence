import { CompensationForm } from "@/components/CompensationForm";
import { RecentSubmissions } from "@/components/RecentSubmissions";

export default function Home() {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8">
      <CompensationForm />
      <RecentSubmissions />
    </main>
  );
}
