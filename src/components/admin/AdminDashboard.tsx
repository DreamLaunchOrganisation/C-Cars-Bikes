"use client";

import { useState } from "react";
import { logout } from "@/actions/admin-auth";
import type { SiteContent } from "@/lib/content/schema";
import { ClientsEditor } from "./ClientsEditor";
import { ContactEditor } from "./ContactEditor";
import { PartnersEditor } from "./PartnersEditor";
import { SalesEditor } from "./SalesEditor";
import styles from "./admin.module.css";

const TABS = [
  { id: "partners", label: "Bandeau" },
  { id: "clients", label: "Nos clients" },
  { id: "sales", label: "Vente" },
  { id: "contact", label: "Coordonnées" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard({ content, storageReady }: { content: SiteContent; storageReady: boolean }) {
  const [tab, setTab] = useState<TabId>("partners");

  return (
    <div className={styles.dashboard}>
      <header className={styles.topbar}>
        <h1 className={styles.loginTitle}>Administration</h1>
        <div className={styles.topActions}>
          <a href="/" target="_blank" rel="noopener" className="btn btn-ghost">
            Voir le site
          </a>
          <form action={logout}>
            <button type="submit" className="btn btn-ghost">
              Se déconnecter
            </button>
          </form>
        </div>
      </header>

      {!storageReady && (
        <p role="alert" className={styles.warning}>
          Le stockage n&apos;est pas configuré (BLOB_READ_WRITE_TOKEN manquant) : les modifications ne pourront pas être
          enregistrées.
        </p>
      )}

      <nav className={styles.tabs} role="tablist" aria-label="Rubriques">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "partners" && <PartnersEditor partners={content.partners} />}
        {tab === "clients" && <ClientsEditor photos={content.clients} />}
        {tab === "sales" && <SalesEditor items={content.sales} />}
        {tab === "contact" && <ContactEditor contact={content.contact} hours={content.openingHours} />}
      </div>
    </div>
  );
}
