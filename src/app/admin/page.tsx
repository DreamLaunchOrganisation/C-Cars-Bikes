import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { isAdmin } from "@/lib/admin/session";
import { getContent } from "@/lib/content";
import { isStorageConfigured } from "@/lib/content/store";

export default function AdminPage() {
  return (
    <Suspense fallback={<p>Chargement…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  // La session se lit à la requête (derrière Suspense) ; le proxy n'est qu'un confort
  if (!(await isAdmin())) redirect("/admin/login");
  const content = await getContent();
  return <AdminDashboard content={content} storageReady={isStorageConfigured()} />;
}
