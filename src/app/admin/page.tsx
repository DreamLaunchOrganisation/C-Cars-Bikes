import { Suspense } from "react";
import { redirect } from "next/navigation";
import { logout } from "@/actions/admin-auth";
import { isAdmin } from "@/lib/admin/session";

export default function AdminPage() {
  return (
    <Suspense fallback={<p>Chargement…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <form action={logout}>
      <p>Connecté.</p>
      <button type="submit" className="btn btn-ghost">
        Se déconnecter
      </button>
    </form>
  );
}
