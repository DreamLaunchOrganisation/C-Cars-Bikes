import type { Metadata } from "next";
import styles from "@/components/admin/admin.module.css";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className={styles.shell}>{children}</div>;
}
