import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/** Mise en page du site public (l'admin a la sienne). */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
