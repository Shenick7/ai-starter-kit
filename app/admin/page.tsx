import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

// Never indexed, never in the sitemap: this page is for the site owner only.
export const metadata: Metadata = {
  title: "Admin dashboard",
  description: "Review tool suggestions, see what people searched for, check site stats and sponsor enquiries.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
